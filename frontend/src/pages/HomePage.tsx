import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../stores/authStore';
import { useTelegramWebApp } from '../hooks/useTelegramWebApp';
import { 
  Package, 
  Gamepad2, 
  Store, 
  Users, 
  TrendingUp, 
  Coins,
  Star,
  Zap
} from 'lucide-react';

const HomePage: React.FC = () => {
  const { user } = useAuthStore();
  const { hapticFeedback } = useTelegramWebApp();

  const features = [
    {
      icon: Package,
      title: 'Кейсы',
      description: 'Открывайте кейсы с уникальными NFT',
      path: '/cases',
      color: 'from-purple-500 to-purple-600',
      emoji: '📦'
    },
    {
      icon: Gamepad2,
      title: 'Игры',
      description: 'Апгрейды, Мины, Краши и другие игры',
      path: '/games',
      color: 'from-cyan-500 to-cyan-600',
      emoji: '🎯'
    },
    {
      icon: Store,
      title: 'Маркетплейс',
      description: 'Покупайте и продавайте NFT',
      path: '/marketplace',
      color: 'from-green-500 to-green-600',
      emoji: '🏪'
    },
    {
      icon: Users,
      title: 'Рефералы',
      description: 'Приглашайте друзей и получайте награды',
      path: '/referrals',
      color: 'from-orange-500 to-orange-600',
      emoji: '👥'
    }
  ];

  const stats = [
    { label: 'Всего кейсов', value: '1,234,567', icon: Package },
    { label: 'Активных игроков', value: '89,012', icon: Users },
    { label: 'Общий объем', value: '5.6M $EZCOIN', icon: Coins },
    { label: 'NFT в продаже', value: '12,345', icon: Store }
  ];

  const quickActions = [
    { label: 'Пополнить', path: '/deposit', icon: TrendingUp, color: 'bg-green-600' },
    { label: 'Вывести', path: '/withdraw', icon: Zap, color: 'bg-blue-600' },
    { label: 'Профиль', path: '/profile', icon: Star, color: 'bg-purple-600' }
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-white mb-2">
          Добро пожаловать в EZDROP! 🟣
        </h1>
        <p className="text-gray-400 text-lg">
          Игровая платформа с кейсами, играми и NFT-маркетплейсом
        </p>
      </motion.div>

      {/* Balance Cards */}
      {user && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm">Баланс $EZCOIN</p>
                <p className="text-2xl font-bold">{user.balance_ezcoin.toFixed(2)}</p>
              </div>
              <Coins className="w-8 h-8 text-yellow-100" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Баланс $EZDROP</p>
                <p className="text-2xl font-bold">{user.balance_ezdrop.toFixed(2)}</p>
              </div>
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-purple-600 rounded-full"></div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold text-white mb-4">Быстрые действия</h2>
        <div className="grid grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={action.path}
              to={action.path}
              onClick={() => hapticFeedback('light')}
              className={`${action.color} rounded-xl p-4 text-white text-center hover:scale-105 transition-transform duration-200`}
            >
              <action.icon className="w-6 h-6 mx-auto mb-2" />
              <p className="text-sm font-medium">{action.label}</p>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2 className="text-xl font-semibold text-white mb-4">Основные функции</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <Link
              key={feature.path}
              to={feature.path}
              onClick={() => hapticFeedback('light')}
              className="group"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-surface rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center text-white text-2xl`}>
                    {feature.emoji}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg mb-1">{feature.title}</h3>
                    <p className="text-gray-400 text-sm">{feature.description}</p>
                  </div>
                  <feature.icon className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors duration-200" />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="text-xl font-semibold text-white mb-4">Статистика платформы</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              className="bg-surface rounded-xl p-4 text-center border border-gray-700"
            >
              <stat.icon className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <p className="text-white font-bold text-lg">{stat.value}</p>
              <p className="text-gray-400 text-xs">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-surface rounded-xl p-6 border border-gray-700"
      >
        <h2 className="text-xl font-semibold text-white mb-4">Последняя активность</h2>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-gray-300">@user123 выбил NFT ✨</span>
            <span className="text-gray-500">2 мин назад</span>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span className="text-gray-300">@gamer456 выиграл 500 $EZCOIN 🎰</span>
            <span className="text-gray-500">5 мин назад</span>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
            <span className="text-gray-300">@player789 продал NFT за 1000 $EZCOIN 💰</span>
            <span className="text-gray-500">8 мин назад</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HomePage; 