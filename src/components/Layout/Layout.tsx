import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../stores/authStore';
import { useTelegramWebApp } from '../../hooks/useTelegramWebApp';
import Navigation from './Navigation';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { user } = useAuthStore();
  const { isTelegramWebApp } = useTelegramWebApp();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <main className="flex-1 flex">
        {/* Navigation (только для десктопа) */}
        {!isTelegramWebApp() && (
          <div className="hidden lg:block w-64 bg-surface border-r border-gray-700">
            <Navigation />
          </div>
        )}
        
        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full overflow-y-auto"
          >
            {children}
          </motion.div>
        </div>
      </main>
      
      {/* Mobile Navigation (только для мобильных устройств вне Telegram) */}
      {!isTelegramWebApp() && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-gray-700 z-50">
          <Navigation />
        </div>
      )}
    </div>
  );
};

export default Layout; 