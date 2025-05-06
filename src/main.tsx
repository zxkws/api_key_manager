import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './index.css';
import { ThemeProvider } from './context/ThemeContext';
import { ApiKeyProvider } from './context/ApiKeyContext';
import { AuthProvider } from './context/AuthContext';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router basename='api_key_manager'>
      <ThemeProvider>
        <AuthProvider>
          <ApiKeyProvider>
            <App />
          </ApiKeyProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  </StrictMode>
);