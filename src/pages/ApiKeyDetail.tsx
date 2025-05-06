import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { useApiKeys } from '../context/ApiKeyContext';
import { useTheme } from '../context/ThemeContext';
import { ApiKey } from '../types';
import { motion } from 'framer-motion';

const ApiKeyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getApiKeyById, removeApiKey } = useApiKeys();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [apiKey, setApiKey] = useState<ApiKey | null>(null);
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    if (id) {
      const foundKey = getApiKeyById(id);
      if (foundKey) {
        setApiKey(foundKey);
        document.title = `API Key | ${foundKey.name}`;
      } else {
        navigate('/not-found');
      }
    }
  }, [id, getApiKeyById, navigate]);
  
  const handleDelete = async () => {
    if (!apiKey || !id) return;
    
    if (window.confirm('Are you sure you want to delete this API key?')) {
      try {
        await removeApiKey(id);
        navigate('/');
      } catch (error) {
        console.error('Failed to delete API key:', error);
      }
    }
  };
  
  const handleEdit = () => {
    if (!id) return;
    navigate(`/api-keys/${id}/edit`);
  };
  
  const handleCopyKey = () => {
    if (!apiKey) return;
    
    navigator.clipboard.writeText(apiKey.key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };
  
  if (!apiKey) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header with back button */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/')}
          className={`p-2 rounded-full ${
            isDark ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-200 text-gray-700'
          }`}
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          API Key Details
        </h1>
      </div>
      
      {/* API Key Detail Card */}
      <div className={`rounded-lg shadow-md overflow-hidden ${
        isDark ? 'bg-gray-800' : 'bg-white'
      }`}>
        {/* Header with name and actions */}
        <div className={`p-6 border-b ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        } flex justify-between items-center`}>
          <div>
            <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {apiKey.name}
            </h2>
            <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm ${
              apiKey.isActive
                ? (isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800')
                : (isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-800')
            }`}>
              {apiKey.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleEdit}
              className={`p-2 rounded-md ${
                isDark ? 'hover:bg-gray-700 text-blue-400' : 'hover:bg-gray-100 text-blue-600'
              }`}
              aria-label="Edit API key"
            >
              <Edit size={20} />
            </button>
            <button
              onClick={handleDelete}
              className={`p-2 rounded-md ${
                isDark ? 'hover:bg-gray-700 text-red-400' : 'hover:bg-gray-100 text-red-600'
              }`}
              aria-label="Delete API key"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
        
        {/* API Key details */}
        <div className="p-6 space-y-6">
          {/* Category and model */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className={`text-sm uppercase font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Category
              </h3>
              <p className={`mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {apiKey.category}
              </p>
            </div>
            <div>
              <h3 className={`text-sm uppercase font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Model
              </h3>
              <p className={`mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {apiKey.model}
              </p>
            </div>
          </div>
          
          {/* Base URL */}
          <div>
            <h3 className={`text-sm uppercase font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Base URL
            </h3>
            <div className="mt-1 flex items-center">
              <p className={`${isDark ? 'text-white' : 'text-gray-900'} flex-grow break-all`}>
                {apiKey.baseUrl}
              </p>
              <button
                onClick={() => navigator.clipboard.writeText(apiKey.baseUrl)}
                className={`ml-2 p-1 rounded ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                aria-label="Copy base URL"
              >
                <Copy size={16} />
              </button>
            </div>
          </div>
          
          {/* API Key */}
          <div>
            <h3 className={`text-sm uppercase font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              API Key
            </h3>
            <div className={`mt-1 p-3 rounded-md font-mono ${
              isDark ? 'bg-gray-700' : 'bg-gray-100'
            } flex items-center`}>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-800'} flex-grow break-all ${
                !showKey ? 'filter blur-sm' : ''
              }`}>
                {apiKey.key}
              </p>
              <div className="flex items-center space-x-2 ml-2">
                <button
                  onClick={() => setShowKey(!showKey)}
                  className={`p-1 rounded ${isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                  aria-label={showKey ? 'Hide API key' : 'Show API key'}
                >
                  {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                <button
                  onClick={handleCopyKey}
                  className={`p-1 rounded ${
                    isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                  } ${copied ? (isDark ? 'text-green-400' : 'text-green-600') : ''}`}
                  aria-label="Copy API key"
                >
                  <Copy size={16} />
                  {copied && <span className="sr-only">Copied!</span>}
                </button>
              </div>
            </div>
          </div>
          
          {/* Description */}
          <div>
            <h3 className={`text-sm uppercase font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Description
            </h3>
            <p className={`mt-1 whitespace-pre-line ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {apiKey.description || 'No description provided.'}
            </p>
          </div>
          
          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-dashed bg-opacity-20 rounded-b-lg mt-6 ${
            isDark ? 'border-gray-700' : 'border-gray-300'
          }">
            <div>
              <h3 className={`text-sm uppercase font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Created
              </h3>
              <p className={`mt-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {formatDate(apiKey.createdAt)}
              </p>
            </div>
            <div>
              <h3 className={`text-sm uppercase font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Last Updated
              </h3>
              <p className={`mt-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {formatDate(apiKey.updatedAt)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ApiKeyDetail;