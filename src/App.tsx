import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ApiKeyDetail from './pages/ApiKeyDetail';
import CreateApiKey from './pages/CreateApiKey';
import EditApiKey from './pages/EditApiKey';
import NotFound from './pages/NotFound';
import { useTheme } from './context/ThemeContext';

function App() {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/api-keys/:id" element={<ApiKeyDetail />} />
          <Route path="/api-keys/create" element={<CreateApiKey />} />
          <Route path="/api-keys/:id/edit" element={<EditApiKey />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </div>
  );
}

export default App;