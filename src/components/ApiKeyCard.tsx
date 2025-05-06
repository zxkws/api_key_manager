import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, Eye, EyeOff, Copy } from 'lucide-react';
import { ApiKey } from '../types';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

interface ApiKeyCardProps {
  apiKey: ApiKey;
  onDelete: (id: string) => void;
}

const ApiKeyCard: React.FC<ApiKeyCardProps> = ({ apiKey, onDelete }) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [showKey, setShowKey] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const isDark = theme === 'dark';

  const truncateKey = (key: string) => {
    if (!key) return '';
    if (showKey) return key;
    return `${key.substring(0, 6)}...${key.substring(key.length - 4)}`;
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey.key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/api-keys/${apiKey.id}/edit`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this API key?')) {
      onDelete(apiKey.id);
    }
  };

  const handleCardClick = () => {
    navigate(`/api-keys/${apiKey.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className={`rounded-lg shadow-md overflow-hidden cursor-pointer ${
        isDark ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'
      } transition-all duration-200`}
      onClick={handleCardClick}
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {apiKey.name}
            </h3>
            <span className={`text-sm ${
              apiKey.isActive 
                ? (isDark ? 'text-green-400' : 'text-green-600') 
                : (isDark ? 'text-red-400' : 'text-red-600')
            }`}>
              {apiKey.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          <div className={`text-sm px-2 py-1 rounded ${
            isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
          }`}>
            {apiKey.category}
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center">
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mr-2`}>Model:</span>
            <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{apiKey.model}</span>
          </div>
          
          <div className="flex items-center">
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mr-2`}>Base URL:</span>
            <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'} truncate`}>{apiKey.baseUrl}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>API Key:</span>
            <div className="flex items-center flex-1">
              <code className={`text-sm font-mono ${isDark ? 'text-gray-300' : 'text-gray-700'} bg-opacity-50 px-1 py-0.5 rounded flex-1 truncate ${
                isDark ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                {truncateKey(apiKey.key)}
              </code>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowKey(!showKey);
                }}
                className={`ml-2 p-1 rounded-full ${
                  isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                }`}
                aria-label={showKey ? 'Hide API key' : 'Show API key'}
              >
                {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopyKey();
                }}
                className={`ml-1 p-1 rounded-full ${
                  isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                } ${copied ? (isDark ? 'text-green-400' : 'text-green-600') : ''}`}
                aria-label="Copy API key"
              >
                <Copy size={16} />
              </button>
            </div>
          </div>
        </div>
        
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} line-clamp-2 mb-4`}>
          {apiKey.description || 'No description provided'}
        </p>
        
        <div className="flex justify-between items-center">
          <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            Updated: {new Date(apiKey.updatedAt).toLocaleDateString()}
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={handleEdit}
              className={`p-1.5 rounded ${
                isDark ? 'hover:bg-gray-700 text-blue-400' : 'hover:bg-gray-200 text-blue-600'
              }`}
              aria-label="Edit API key"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={handleDelete}
              className={`p-1.5 rounded ${
                isDark ? 'hover:bg-gray-700 text-red-400' : 'hover:bg-gray-200 text-red-600'
              }`}
              aria-label="Delete API key"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ApiKeyCard;