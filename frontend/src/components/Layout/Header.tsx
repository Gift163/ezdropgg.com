import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../stores/authStore';
import { useTelegramWebApp } from '../../hooks/useTelegramWebApp';
import { Coins, User, Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const { user } = useAuthStore();
  const { isTelegramWebApp, hapticFeedback } = useTelegramWebApp();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    hapticFeedback('light');
  };

  return (
    <header className="bg-surface border-b border-gray-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-8 h-8 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg flex items-center justify-center"
            >
              <span className="text-white font-bold text-lg">E</span>
            </motion.div>
            <span className="text-white font-bold text-xl">EZDROP</span>
          </Link>

          {/* Balance (только для Telegram WebApp) */}
          {isTelegramWebApp() && user && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gray-800 rounded-lg px-3 py-2">
                <Coins className="w-4 h-4 text-yellow-400" />
                <span className="text-white font-semibold">
                  {user.balance_ezcoin.toFixed(2)}
                </span>
                <span className="text-gray-400 text-sm">$EZCOIN</span>
              </div>
              
              <div className="flex items-center space-x-2 bg-gray-800 rounded-lg px-3 py-2">
                <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                <span className="text-white font-semibold">
                  {user.balance_ezdrop.toFixed(2)}
                </span>
                <span className="text-gray-400 text-sm">$EZDROP</span>
              </div>
            </div>
          )}

          {/* Profile Menu */}
          <div className="flex items-center space-x-4">
            {user && (
              <Link
                to="/profile"
                className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 rounded-lg px-3 py-2 transition-colors duration-200"
                onClick={() => hapticFeedback('light')}
              >
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-white font-medium">
                  {user.first_name || user.username || 'User'}
                </span>
              </Link>
            )}

            {/* Mobile Menu Button */}
            {!isTelegramWebApp() && (
              <button
                onClick={toggleMenu}
                className="lg:hidden p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors duration-200"
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5 text-white" />
                ) : (
                  <Menu className="w-5 h-5 text-white" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {!isTelegramWebApp() && isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-gray-700 bg-surface"
          >
            <div className="px-4 py-4 space-y-2">
              {user && (
                <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Coins className="w-4 h-4 text-yellow-400" />
                    <span className="text-white font-semibold">
                      {user.balance_ezcoin.toFixed(2)} $EZCOIN
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-white font-semibold">
                      {user.balance_ezdrop.toFixed(2)} $EZDROP
                    </span>
                  </div>
                </div>
              )}
              
              <Link
                to="/cases"
                className="block p-3 text-white hover:bg-gray-700 rounded-lg transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                📦 Кейсы
              </Link>
              <Link
                to="/games"
                className="block p-3 text-white hover:bg-gray-700 rounded-lg transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                🎯 Игры
              </Link>
              <Link
                to="/marketplace"
                className="block p-3 text-white hover:bg-gray-700 rounded-lg transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                🏪 Маркетплейс
              </Link>
              <Link
                to="/referrals"
                className="block p-3 text-white hover:bg-gray-700 rounded-lg transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                👥 Рефералы
              </Link>
              <Link
                to="/deposit"
                className="block p-3 text-white hover:bg-gray-700 rounded-lg transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                💳 Пополнить
              </Link>
              <Link
                to="/withdraw"
                className="block p-3 text-white hover:bg-gray-700 rounded-lg transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                💸 Вывести
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header; 