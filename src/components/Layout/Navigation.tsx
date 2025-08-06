import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTelegramWebApp } from '../../hooks/useTelegramWebApp';
import { 
  Home, 
  Package, 
  Gamepad2, 
  Store, 
  Users, 
  CreditCard, 
  Wallet,
  User,
  Settings,
  LogOut
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

const Navigation: React.FC = () => {
  const location = useLocation();
  const { isTelegramWebApp, hapticFeedback } = useTelegramWebApp();
  const { logout } = useAuthStore();

  const navigationItems = [
    { path: '/', icon: Home, label: 'Главная', emoji: '🏠' },
    { path: '/cases', icon: Package, label: 'Кейсы', emoji: '📦' },
    { path: '/games', icon: Gamepad2, label: 'Игры', emoji: '🎯' },
    { path: '/marketplace', icon: Store, label: 'Маркетплейс', emoji: '🏪' },
    { path: '/referrals', icon: Users, label: 'Рефералы', emoji: '👥' },
    { path: '/deposit', icon: CreditCard, label: 'Пополнить', emoji: '💳' },
    { path: '/withdraw', icon: Wallet, label: 'Вывести', emoji: '💸' },
    { path: '/profile', icon: User, label: 'Профиль', emoji: '👤' },
  ];

  const handleLogout = () => {
    hapticFeedback('medium');
    logout();
  };

  return (
    <nav className="flex flex-col h-full">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-700">
        <Link to="/" className="flex items-center space-x-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-xl flex items-center justify-center"
          >
            <span className="text-white font-bold text-xl">E</span>
          </motion.div>
          <div>
            <h1 className="text-white font-bold text-lg">EZDROP</h1>
            <p className="text-gray-400 text-xs">Gaming Platform</p>
          </div>
        </Link>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => hapticFeedback('light')}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`w-6 h-6 flex items-center justify-center ${
                  isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                }`}
              >
                <Icon size={20} />
              </motion.div>
              <span className="font-medium">{item.label}</span>
              <span className="text-lg ml-auto">{item.emoji}</span>
            </Link>
          );
        })}
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-700 space-y-2">
        {/* Settings */}
        <button
          onClick={() => hapticFeedback('light')}
          className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200 w-full"
        >
          <Settings size={20} />
          <span className="font-medium">Настройки</span>
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 w-full"
        >
          <LogOut size={20} />
          <span className="font-medium">Выйти</span>
        </button>

        {/* Version Info */}
        <div className="px-4 py-2 text-center">
          <p className="text-gray-500 text-xs">v1.0.0</p>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 