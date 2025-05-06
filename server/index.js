import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { authMiddleware } from './authMiddleware.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection pool
let pool;
let connection;



// docker run -d --name mysql-container -p 3306:3306 -e MYSQL_ROOT_PASSWORD='123456' mysql:8.0
// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_NAME || 'api_key_manager',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Initialize database connection
async function initializeDatabase() {
  try {
    // Create connection pool
    pool = mysql.createPool(dbConfig);
    try {
      connection = await pool.getConnection();
    } catch (error) {
      const newConfig = {...dbConfig};
      delete newConfig.database;
      pool = mysql.createPool(newConfig);
      connection = await pool.getConnection();
      await connection.execute('CREATE DATABASE IF NOT EXISTS api_key_manager');
      await connection.release();
      pool = mysql.createPool(dbConfig);
      connection = await pool.getConnection();
    }
    
    // Create tables if they don't exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS api_keys (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        \`key\` TEXT NOT NULL,
        base_url VARCHAR(255) NOT NULL,
        model VARCHAR(100) NOT NULL,
        description TEXT,
        category VARCHAR(50) DEFAULT 'General',
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        user_id VARCHAR(36) NOT NULL
      )
    `);
    
    console.log('Database tables initialized');
    connection.release();
  } catch (error) {
    console.error('Database initialization error:', error);
    
    // Fallback to in-memory data if database connection fails
    console.log('Using in-memory data store as fallback');
    global.inMemoryApiKeys = [];
  }
}

// Helper function to execute queries
async function query(sql, params) {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Convert database rows to camelCase
function toCamelCase(rows) {
  return rows.map(row => {
    const newRow = {};
    for (const key in row) {
      // Convert snake_case to camelCase
      const newKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      newRow[newKey] = row[key];
    }
    return newRow;
  });
}

// Initialize data store if database connection fails
global.inMemoryApiKeys = [];

app.use(authMiddleware);

// API Routes
app.get('/api/api-keys', async (req, res) => {
  try {
    const userId = req.user.userId;
    if (pool) {
      const apiKeys = await query('SELECT * FROM api_keys WHERE user_id = ? ORDER BY updated_at DESC', [userId]);
      res.json(toCamelCase(apiKeys));
    } else {
      const userApiKeys = global.inMemoryApiKeys.filter(key => key.userId === userId);
      res.json(userApiKeys);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch API keys' });
  }
});

app.get('/api/api-keys/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    
    if (pool) {
      const [apiKey] = await query('SELECT * FROM api_keys WHERE id = ? AND user_id = ?', [id, userId]);
      
      if (!apiKey) {
        return res.status(404).json({ error: 'API key not found' });
      }
      
      res.json(toCamelCase([apiKey])[0]);
    } else {
      const apiKey = global.inMemoryApiKeys.find(key => key.id === id && key.userId === userId);
      
      if (!apiKey) {
        return res.status(404).json({ error: 'API key not found' });
      }
      
      res.json(apiKey);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch API key' });
  }
});

app.post('/api/api-keys', async (req, res) => {
  try {
    const {
      name,
      key,
      baseUrl,
      model,
      description,
      category,
      isActive
    } = req.body;
    const userId = req.user.userId;
    
    // Generate UUID
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    
    if (pool) {
      await query(
        'INSERT INTO api_keys (id, name, `key`, base_url, model, description, category, is_active, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [id, name, key, baseUrl, model, description, category, isActive, userId]
      );
      
      const [newApiKey] = await query('SELECT * FROM api_keys WHERE id = ? AND user_id = ?', [id, userId]);
      res.status(201).json(toCamelCase([newApiKey])[0]);
    } else {
      const newApiKey = {
        id,
        name,
        key,
        baseUrl,
        model,
        description,
        category,
        isActive,
        createdAt,
        updatedAt,
        userId
      };
      
      global.inMemoryApiKeys.push(newApiKey);
      res.status(201).json(newApiKey);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to create API key' });
  }
});

app.put('/api/api-keys/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const {
      name,
      key,
      baseUrl,
      model,
      description,
      category,
      isActive
    } = req.body;
    
    if (pool) {
      // Check if API key exists
      const [existingApiKey] = await query('SELECT * FROM api_keys WHERE id = ? AND user_id = ?', [id, userId]);
      
      if (!existingApiKey) {
        return res.status(404).json({ error: 'API key not found' });
      }
      
      // Update API key
      await query(
        'UPDATE api_keys SET name = ?, `key` = ?, base_url = ?, model = ?, description = ?, category = ?, is_active = ? WHERE id = ? AND user_id = ?',
        [name, key, baseUrl, model, description, category, isActive, id, userId]
      );
      
      const [updatedApiKey] = await query('SELECT * FROM api_keys WHERE id = ? AND user_id = ?', [id, userId]);
      res.json(toCamelCase([updatedApiKey])[0]);
    } else {
      const apiKeyIndex = global.inMemoryApiKeys.findIndex(key => key.id === id && key.userId === userId);
      
      if (apiKeyIndex === -1) {
        return res.status(404).json({ error: 'API key not found' });
      }
      
      const updatedApiKey = {
        ...global.inMemoryApiKeys[apiKeyIndex],
        name,
        key,
        baseUrl,
        model,
        description,
        category,
        isActive,
        updatedAt: new Date().toISOString()
      };
      
      global.inMemoryApiKeys[apiKeyIndex] = updatedApiKey;
      res.json(updatedApiKey);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update API key' });
  }
});

app.delete('/api/api-keys/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    
    if (pool) {
      // Check if API key exists
      const [existingApiKey] = await query('SELECT * FROM api_keys WHERE id = ? AND user_id = ?', [id, userId]);
      
      if (!existingApiKey) {
        return res.status(404).json({ error: 'API key not found' });
      }
      
      // Delete API key
      await query('DELETE FROM api_keys WHERE id = ? AND user_id = ?', [id, userId]);
      res.status(204).send();
    } else {
      const apiKeyIndex = global.inMemoryApiKeys.findIndex(key => key.id === id && key.userId === userId);
      
      if (apiKeyIndex === -1) {
        return res.status(404).json({ error: 'API key not found' });
      }
      
      global.inMemoryApiKeys.splice(apiKeyIndex, 1);
      res.status(204).send();
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete API key' });
  }
});

// Start server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  
  // Initialize database
  await initializeDatabase();
});