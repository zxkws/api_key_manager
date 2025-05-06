import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ApiKeyDetail from './pages/ApiKeyDetail';
import CreateApiKey from './pages/CreateApiKey';
import EditApiKey from './pages/EditApiKey';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import { useTheme } from './context/ThemeContext';
import { useAuth } from './context/AuthContext';

function App() {
  const { theme } = useTheme();
  const { login } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Handle authentication callback
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    
    if (token) {
      login(token);
      // Clean up the URL
      window.history.replaceState({}, '', location.pathname);
    }
  }, [location, login]);

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <Layout>
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/api-keys/:id" element={
            <ProtectedRoute>
              <ApiKeyDetail />
            </ProtectedRoute>
          } />
          <Route path="/api-keys/create" element={
            <ProtectedRoute>
              <CreateApiKey />
            </ProtectedRoute>
          } />
          <Route path="/api-keys/:id/edit" element={
            <ProtectedRoute>
              <EditApiKey />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </div>
  );
}

export default App