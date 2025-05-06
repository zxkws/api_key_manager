import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiKeyFormData } from '../types';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import { Eye, EyeOff, RefreshCw } from 'lucide-react';

interface ApiKeyFormProps {
  initialData?: Partial<ApiKeyFormData>;
  onSubmit: (data: ApiKeyFormData) => Promise<void>;
  isEditing?: boolean;
}

const ApiKeyForm: React.FC<ApiKeyFormProps> = ({ 
  initialData = {}, 
  onSubmit,
  isEditing = false
}) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [formData, setFormData] = useState<ApiKeyFormData>({
    name: initialData.name || '',
    key: initialData.key || '',
    baseUrl: initialData.baseUrl || '',
    model: initialData.model || '',
    description: initialData.description || '',
    category: initialData.category || 'General',
    isActive: initialData.isActive !== undefined ? initialData.isActive : true,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.key.trim()) {
      newErrors.key = 'API Key is required';
    }
    
    if (!formData.baseUrl.trim()) {
      newErrors.baseUrl = 'Base URL is required';
    } else if (!/^https?:\/\//.test(formData.baseUrl)) {
      newErrors.baseUrl = 'Base URL must start with http:// or https://';
    }
    
    if (!formData.model.trim()) {
      newErrors.model = 'Model is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : value
    }));
    
    // Clear error for this field when user edits it
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      navigate('/');
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors(prev => ({ 
        ...prev, 
        form: 'An error occurred while saving. Please try again.' 
      }));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const generateRandomApiKey = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = 32;
    let result = '';
    
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    setFormData(prev => ({ ...prev, key: result }));
    setShowApiKey(true);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`max-w-2xl mx-auto rounded-lg shadow-md ${
        isDark ? 'bg-gray-800' : 'bg-white'
      } p-6 md:p-8`}
    >
      <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        {isEditing ? 'Edit API Key' : 'Create New API Key'}
      </h2>
      
      {errors.form && (
        <div className="mb-6 p-4 rounded-md bg-red-100 text-red-700 border border-red-200">
          {errors.form}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Name field */}
          <div>
            <label htmlFor="name" className={`block text-sm font-medium mb-1 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Production OpenAI Key"
              className={`w-full px-4 py-2 rounded-md border ${
                errors.name ? 'border-red-500' : (isDark ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900')
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>
          
          {/* API Key field */}
          <div>
            <label htmlFor="key" className={`block text-sm font-medium mb-1 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              API Key <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                id="key"
                name="key"
                value={formData.key}
                onChange={handleChange}
                placeholder="Your API key"
                className={`w-full px-4 py-2 pr-20 rounded-md border ${
                  errors.key ? 'border-red-500' : (isDark ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900')
                } font-mono focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-2">
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className={`p-1 rounded ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                <button
                  type="button"
                  onClick={generateRandomApiKey}
                  className={`p-1 rounded ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
                  title="Generate random API key"
                >
                  <RefreshCw size={18} />
                </button>
              </div>
            </div>
            {errors.key && <p className="mt-1 text-sm text-red-500">{errors.key}</p>}
          </div>
          
          {/* Base URL field */}
          <div>
            <label htmlFor="baseUrl" className={`block text-sm font-medium mb-1 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Base URL <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="baseUrl"
              name="baseUrl"
              value={formData.baseUrl}
              onChange={handleChange}
              placeholder="https://api.example.com"
              className={`w-full px-4 py-2 rounded-md border ${
                errors.baseUrl ? 'border-red-500' : (isDark ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900')
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.baseUrl && <p className="mt-1 text-sm text-red-500">{errors.baseUrl}</p>}
          </div>
          
          {/* Model field */}
          <div>
            <label htmlFor="model" className={`block text-sm font-medium mb-1 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Model <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="model"
              name="model"
              value={formData.model}
              onChange={handleChange}
              placeholder="e.g., gpt-4, claude-2, etc."
              className={`w-full px-4 py-2 rounded-md border ${
                errors.model ? 'border-red-500' : (isDark ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900')
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.model && <p className="mt-1 text-sm text-red-500">{errors.model}</p>}
          </div>
          
          {/* Category field */}
          <div>
            <label htmlFor="category" className={`block text-sm font-medium mb-1 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-md border ${
                isDark ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="General">General</option>
              <option value="Development">Development</option>
              <option value="Production">Production</option>
              <option value="Testing">Testing</option>
              <option value="Personal">Personal</option>
              <option value="Work">Work</option>
            </select>
          </div>
          
          {/* Description field */}
          <div>
            <label htmlFor="description" className={`block text-sm font-medium mb-1 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Add notes about this API key..."
              className={`w-full px-4 py-2 rounded-md border ${
                isDark ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>
          
          {/* Active status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleCheckboxChange}
              className={`w-4 h-4 rounded ${
                isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
              } focus:ring-blue-500 focus:ring-2`}
            />
            <label htmlFor="isActive" className={`ml-2 text-sm ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Active
            </label>
          </div>
          
          {/* Form actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className={`px-4 py-2 rounded-md ${
                isDark 
                  ? 'bg-gray-700 text-white hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              } transition-colors`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 rounded-md bg-blue-600 text-white ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
              } transition-colors flex items-center`}
            >
              {isSubmitting && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isEditing ? 'Update API Key' : 'Create API Key'}
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default ApiKeyForm;