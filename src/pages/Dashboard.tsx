import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, X } from 'lucide-react';
import ApiKeyCard from '../components/ApiKeyCard';
import { useApiKeys } from '../context/ApiKeyContext';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard: React.FC = () => {
  const { apiKeys, loading, error, removeApiKey, refreshApiKeys } = useApiKeys();
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<boolean | null>(null);
  
  const isDark = theme === 'dark';
  
  useEffect(() => {
    document.title = 'API Key Manager | Dashboard';
    refreshApiKeys();
  }, [refreshApiKeys]);
  
  const handleAddApiKey = () => {
    navigate('/api-keys/create');
  };
  
  const handleDelete = async (id: string) => {
    try {
      await removeApiKey(id);
    } catch (error) {
      console.error('Failed to delete API key:', error);
      // You could add a toast notification here
    }
  };
  
  // Extract unique categories from API keys
  const categories = Array.from(new Set(apiKeys.map(key => key.category))).sort();
  
  // Filter API keys based on search term, category, and active status
  const filteredApiKeys = apiKeys.filter(key => {
    const matchesSearch = searchTerm === '' || 
      key.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      key.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      key.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      key.baseUrl.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === '' || key.category === selectedCategory;
    
    const matchesActive = activeFilter === null || key.isActive === activeFilter;
    
    return matchesSearch && matchesCategory && matchesActive;
  });
  
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setActiveFilter(null);
  };
  
  const hasActiveFilters = searchTerm !== '' || selectedCategory !== '' || activeFilter !== null;
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          API Key Manager
        </h1>
        <button
          onClick={handleAddApiKey}
          className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Add New API Key
        </button>
      </div>
      
      {/* Search and filters */}
      <div className="space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
          </div>
          <input
            type="text"
            placeholder="Search by name, model, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`pl-10 pr-4 py-3 w-full rounded-md ${
              isDark
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>
        
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center">
            <Filter size={18} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
            <span className={`ml-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Filters:
            </span>
          </div>
          
          {/* Category filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={`text-sm rounded-md border ${
              isDark
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            } py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          
          {/* Active/Inactive filter */}
          <select
            value={activeFilter === null ? '' : activeFilter ? 'active' : 'inactive'}
            onChange={(e) => {
              if (e.target.value === '') setActiveFilter(null);
              else setActiveFilter(e.target.value === 'active');
            }}
            className={`text-sm rounded-md border ${
              isDark
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            } py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          
          {/* Clear filters button */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className={`flex items-center text-sm py-1.5 px-3 rounded-md ${
                isDark
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              } transition-colors`}
            >
              <X size={16} className="mr-1" />
              Clear Filters
            </button>
          )}
        </div>
      </div>
      
      {/* API key grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className={`p-4 rounded-md ${isDark ? 'bg-red-900/30' : 'bg-red-100'} ${isDark ? 'text-red-300' : 'text-red-700'} text-center`}>
          {error}
        </div>
      ) : filteredApiKeys.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`p-8 rounded-lg text-center ${
            isDark ? 'bg-gray-800' : 'bg-gray-100'
          }`}
        >
          {hasActiveFilters ? (
            <>
              <p className={`text-lg mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                No API keys match your filters
              </p>
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              >
                Clear Filters
              </button>
            </>
          ) : (
            <>
              <p className={`text-lg mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                No API keys found. Add your first API key to get started.
              </p>
              <button
                onClick={handleAddApiKey}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              >
                Add New API Key
              </button>
            </>
          )}
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredApiKeys.map(apiKey => (
              <ApiKeyCard
                key={apiKey.id}
                apiKey={apiKey}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Dashboard;