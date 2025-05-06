import { ApiKey } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Fetch all API keys
export const fetchApiKeys = async (): Promise<ApiKey[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api-keys`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching API keys:', error);
    
    // Fallback to local storage in development or if backend is not available
    if (import.meta.env.DEV) {
      const storedKeys = localStorage.getItem('apiKeys');
      if (storedKeys) {
        return JSON.parse(storedKeys);
      }
      return [];
    }
    
    throw error;
  }
};

// Fetch a single API key by ID
export const fetchApiKeyById = async (id: string): Promise<ApiKey> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api-keys/${id}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching API key with ID ${id}:`, error);
    
    // Fallback to local storage in development
    if (import.meta.env.DEV) {
      const storedKeys = localStorage.getItem('apiKeys');
      if (storedKeys) {
        const keys = JSON.parse(storedKeys) as ApiKey[];
        const key = keys.find(k => k.id === id);
        if (key) return key;
      }
    }
    
    throw error;
  }
};

// Create a new API key
export const createApiKey = async (apiKeyData: Omit<ApiKey, 'id'>): Promise<ApiKey> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api-keys`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiKeyData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating API key:', error);
    
    // Fallback to local storage in development
    if (import.meta.env.DEV) {
      const newKey = {
        ...apiKeyData,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as ApiKey;
      
      const storedKeys = localStorage.getItem('apiKeys');
      const keys = storedKeys ? JSON.parse(storedKeys) : [];
      const updatedKeys = [...keys, newKey];
      localStorage.setItem('apiKeys', JSON.stringify(updatedKeys));
      
      return newKey;
    }
    
    throw error;
  }
};

// Update an existing API key
export const updateApiKey = async (id: string, apiKeyData: Partial<ApiKey>): Promise<ApiKey> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api-keys/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiKeyData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error updating API key with ID ${id}:`, error);
    
    // Fallback to local storage in development
    if (import.meta.env.DEV) {
      const storedKeys = localStorage.getItem('apiKeys');
      if (storedKeys) {
        const keys = JSON.parse(storedKeys) as ApiKey[];
        const updatedKeys = keys.map(key => {
          if (key.id === id) {
            return {
              ...key,
              ...apiKeyData,
              updatedAt: new Date().toISOString(),
            };
          }
          return key;
        });
        
        localStorage.setItem('apiKeys', JSON.stringify(updatedKeys));
        return updatedKeys.find(k => k.id === id) as ApiKey;
      }
    }
    
    throw error;
  }
};

// Delete an API key
export const deleteApiKey = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api-keys/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error deleting API key with ID ${id}:`, error);
    
    // Fallback to local storage in development
    if (import.meta.env.DEV) {
      const storedKeys = localStorage.getItem('apiKeys');
      if (storedKeys) {
        const keys = JSON.parse(storedKeys) as ApiKey[];
        const filteredKeys = keys.filter(key => key.id !== id);
        localStorage.setItem('apiKeys', JSON.stringify(filteredKeys));
        return;
      }
    }
    
    throw error;
  }
};