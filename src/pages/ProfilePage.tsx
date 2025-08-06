import React from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../stores/authStore';
import { useTelegramWebApp } from '../hooks/useTelegramWebApp';
import { User, Coins, Calendar, Copy, Share2, Settings, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { hapticFeedback } = useTelegramWebApp();

  if (!user) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-400">Необходимо авторизоваться</p>
      </div>
    );
  }

  const copyReferralLink = () => {
    const link = `https://t.me/ezdrop_bot?start=${user.referral_code}`;
    navigator.clipboard.writeText(link);
    toast.success('Реферальная ссылка скопирована!');
    hapticFeedback('light');
  };

  const shareProfile = () => {
    if (navigator.share) {
      navigator.share({
        title: 'EZDROP Profile',
        text: `Посмотрите мой профиль в EZDROP!`,
        url: `https://t.me/ezdrop_bot?start=${user.referral_code}`
      });
    } else {
      copyReferralLink();
    }
    hapticFeedback('light');
  };

  const handleLogout = () => {
    hapticFeedback('medium');
    logout();
    toast.success('Вы вышли из аккаунта');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">👤 Профиль</h1>
        <p className="text-gray-400">Управление аккаунтом и настройками</p>
      </div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface rounded-xl p-6 border border-gray-700"
      >
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-white font-bold text-xl">
              {user.first_name} {user.last_name}
            </h2>
            <p className="text-gray-400">@{user.username || 'user'}</p>
          </div>
        </div>

        {/* Balance Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Coins className="w-5 h-5 text-yellow-400" />
              <span className="text-gray-400 text-sm">Баланс $EZCOIN</span>
            </div>
            <p className="text-white font-bold text-2xl">{user.balance_ezcoin.toFixed(2)}</p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-5 h-5 bg-purple-500 rounded-full"></div>
              <span className="text-gray-400 text-sm">Баланс $EZDROP</span>
            </div>
            <p className="text-white font-bold text-2xl">{user.balance_ezdrop.toFixed(2)}</p>
          </div>
        </div>

        {/* User Info */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">ID пользователя:</span>
            <span className="text-white font-mono">{user.telegram_id}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Дата регистрации:</span>
            <span className="text-white">
              {new Date(user.created_at).toLocaleDateString('ru-RU')}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Последний вход:</span>
            <span className="text-white">
              {new Date(user.last_login).toLocaleDateString('ru-RU')}
            </span>
          </div>
        </div>

        {/* Referral Section */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <h3 className="text-white font-semibold mb-3">👥 Реферальная программа</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Реферальный код:</span>
              <span className="text-white font-mono">{user.referral_code}</span>
            </div>
            {user.referred_by && (
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Приглашен от:</span>
                <span className="text-white">{user.referred_by}</span>
              </div>
            )}
            <div className="flex space-x-2">
              <button
                onClick={copyReferralLink}
                className="flex-1 flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
              >
                <Copy className="w-4 h-4" />
                <span>Копировать ссылку</span>
              </button>
              <button
                onClick={shareProfile}
                className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
              >
                <Share2 className="w-4 h-4" />
                <span>Поделиться</span>
              </button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => hapticFeedback('light')}
            className="w-full flex items-center justify-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg transition-colors duration-200"
          >
            <Settings className="w-4 h-4" />
            <span>Настройки</span>
          </button>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg transition-colors duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span>Выйти</span>
          </button>
        </div>
      </motion.div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface rounded-xl p-4 text-center border border-gray-700">
          <div className="text-2xl mb-2">📦</div>
          <p className="text-white font-bold text-lg">0</p>
          <p className="text-gray-400 text-sm">Открыто кейсов</p>
        </div>
        <div className="bg-surface rounded-xl p-4 text-center border border-gray-700">
          <div className="text-2xl mb-2">🎯</div>
          <p className="text-white font-bold text-lg">0</p>
          <p className="text-gray-400 text-sm">Игр сыграно</p>
        </div>
        <div className="bg-surface rounded-xl p-4 text-center border border-gray-700">
          <div className="text-2xl mb-2">🏪</div>
          <p className="text-white font-bold text-lg">0</p>
          <p className="text-gray-400 text-sm">NFT в коллекции</p>
        </div>
        <div className="bg-surface rounded-xl p-4 text-center border border-gray-700">
          <div className="text-2xl mb-2">👥</div>
          <p className="text-white font-bold text-lg">0</p>
          <p className="text-gray-400 text-sm">Рефералов</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 