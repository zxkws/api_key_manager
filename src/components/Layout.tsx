import React, { ReactNode, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Sun, Moon, Plus, Search, Layers } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isDark = theme === 'dark';

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Create New API Key', path: '/api-keys/create', icon: <Plus size={18} /> },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className={`sticky top-0 z-10 ${
        isDark ? 'bg-gray-800' : 'bg-white'
      } shadow-sm transition-colors duration-200`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3">
              <Layers className={`h-8 w-8 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              <h1 className="text-xl font-semibold">API Key Manager</h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search API keys..."
                  className={`pl-10 pr-4 py-2 rounded-md ${
                    isDark 
                      ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600' 
                      : 'bg-gray-100 text-gray-900 border-gray-300'
                  } border focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 transition-all`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`flex items-center space-x-1 py-2 px-3 rounded-md ${
                    isDark
                      ? 'hover:bg-gray-700 text-gray-200'
                      : 'hover:bg-gray-100 text-gray-800'
                  } transition-colors`}
                >
                  {item.icon && item.icon}
                  <span>{item.name}</span>
                </button>
              ))}
              
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full ${
                  isDark ? 'bg-gray-700 text-yellow-300' : 'bg-gray-100 text-gray-700'
                } transition-colors`}
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </nav>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={toggleTheme}
                className={`p-2 mr-2 rounded-full ${
                  isDark ? 'bg-gray-700 text-yellow-300' : 'bg-gray-100 text-gray-700'
                } transition-colors`}
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              
              <button
                onClick={toggleMobileMenu}
                className={`p-2 rounded-md ${
                  isDark ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-800 hover:bg-gray-100'
                }`}
                aria-label="Menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className={`md:hidden ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-md`}
          >
            <div className="container mx-auto px-4 py-3">
              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search API keys..."
                  className={`pl-10 pr-4 py-2 rounded-md ${
                    isDark 
                      ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600' 
                      : 'bg-gray-100 text-gray-900 border-gray-300'
                  } border focus:outline-none focus:ring-2 focus:ring-blue-500 w-full transition-all`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <nav className="flex flex-col space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`flex items-center space-x-2 py-3 px-4 rounded-md ${
                      isDark
                        ? 'hover:bg-gray-700 text-gray-200'
                        : 'hover:bg-gray-100 text-gray-800'
                    } transition-colors`}
                  >
                    {item.icon && item.icon}
                    <span>{item.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-grow py-6 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className={`py-6 ${
        isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
      } transition-colors duration-200`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm">
            API Key Management Platform © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;