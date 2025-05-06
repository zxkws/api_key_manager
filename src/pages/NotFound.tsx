import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  React.useEffect(() => {
    document.title = 'API Key Manager | Page Not Found';
  }, []);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center text-center py-12"
    >
      <div className={`text-6xl font-bold mb-4 ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
        404
      </div>
      <h1 className={`text-2xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Page Not Found
      </h1>
      <p className={`mb-8 max-w-md ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
        The page you are looking for doesn't exist or has been moved.
      </p>
      <button
        onClick={() => navigate('/')}
        className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
      >
        <Home size={20} className="mr-2" />
        Back to Dashboard
      </button>
    </motion.div>
  );
};

export default NotFound;