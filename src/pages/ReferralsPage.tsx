import React from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../stores/authStore';
import { useTelegramWebApp } from '../hooks/useTelegramWebApp';
import { Users, Copy, Share2, Gift, TrendingUp, Star } from 'lucide-react';
import toast from 'react-hot-toast';

const ReferralsPage: React.FC = () => {
  const { user } = useAuthStore();
  const { hapticFeedback } = useTelegramWebApp();

  const referralRewards = [
    { count: 5, reward: 100, icon: '🎁' },
    { count: 10, reward: 250, icon: '🎉' },
    { count: 50, reward: 1500, icon: '🏆' },
    { count: 100, reward: 3500, icon: '👑' },
    { count: 1000, reward: 50000, icon: '💎' }
  ];

  const copyReferralLink = () => {
    if (!user) return;
    
    const link = `https://t.me/ezdrop_bot?start=${user.referral_code}`;
    navigator.clipboard.writeText(link);
    toast.success('Реферальная ссылка скопирована!');
    hapticFeedback('light');
  };

  const shareReferral = () => {
    if (!user) return;
    
    if (navigator.share) {
      navigator.share({
        title: 'EZDROP - Реферальная программа',
        text: `Присоединяйтесь к EZDROP и получите бонус! Используйте мою реферальную ссылку:`,
        url: `https://t.me/ezdrop_bot?start=${user.referral_code}`
      });
    } else {
      copyReferralLink();
    }
    hapticFeedback('light');
  };

  if (!user) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-400">Необходимо авторизоваться</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">👥 Реферальная программа</h1>
        <p className="text-gray-400">Приглашайте друзей и получайте награды</p>
      </div>

      {/* Referral Link */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface rounded-xl p-6 border border-gray-700"
      >
        <h3 className="text-white font-semibold text-lg mb-4">🔗 Ваша реферальная ссылка</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={`https://t.me/ezdrop_bot?start=${user.referral_code}`}
              readOnly
              className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white font-mono text-sm"
            />
            <button
              onClick={copyReferralLink}
              className="px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={shareReferral}
              className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
          
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Gift className="w-5 h-5 text-green-400" />
              <p className="text-green-400 text-sm">
                Каждый реферал получает 50 $EZCOIN при регистрации!
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="bg-surface rounded-xl p-6 text-center border border-gray-700">
          <Users className="w-8 h-8 text-purple-400 mx-auto mb-2" />
          <p className="text-white font-bold text-2xl">0</p>
          <p className="text-gray-400 text-sm">Всего рефералов</p>
        </div>
        
        <div className="bg-surface rounded-xl p-6 text-center border border-gray-700">
          <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <p className="text-white font-bold text-2xl">0</p>
          <p className="text-gray-400 text-sm">Заработано $EZCOIN</p>
        </div>
        
        <div className="bg-surface rounded-xl p-6 text-center border border-gray-700">
          <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
          <p className="text-white font-bold text-2xl">0</p>
          <p className="text-gray-400 text-sm">Активных рефералов</p>
        </div>
      </motion.div>

      {/* Rewards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-white font-semibold text-lg mb-4">💰 Система наград</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {referralRewards.map((reward, index) => (
            <motion.div
              key={reward.count}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="bg-surface rounded-xl p-6 border border-gray-700 text-center hover:border-purple-500 transition-all duration-300"
            >
              <div className="text-4xl mb-3">{reward.icon}</div>
              <h4 className="text-white font-semibold text-lg mb-2">
                {reward.count} рефералов
              </h4>
              <p className="text-green-400 font-bold text-xl mb-2">
                {reward.reward.toLocaleString()} $EZCOIN
              </p>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: '0%' }} // В реальном приложении здесь будет прогресс
                ></div>
              </div>
              <p className="text-gray-400 text-sm mt-2">
                0 / {reward.count} рефералов
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* How it works */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-800 rounded-xl p-6 border border-gray-700"
      >
        <h3 className="text-white font-semibold text-lg mb-4">📋 Как это работает</h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
              1
            </div>
            <div>
              <p className="text-white font-medium">Поделитесь реферальной ссылкой</p>
              <p className="text-gray-400 text-sm">Отправьте ссылку друзьям в Telegram или социальных сетях</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
              2
            </div>
            <div>
              <p className="text-white font-medium">Друг регистрируется по вашей ссылке</p>
              <p className="text-gray-400 text-sm">Он получает 50 $EZCOIN в подарок при регистрации</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
              3
            </div>
            <div>
              <p className="text-white font-medium">Вы получаете награды</p>
              <p className="text-gray-400 text-sm">При достижении определенного количества рефералов вы получаете бонусы</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6"
      >
        <h3 className="text-blue-400 font-semibold text-lg mb-4">💡 Советы для привлечения рефералов</h3>
        <div className="space-y-3 text-sm text-blue-300">
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
            <p>Поделитесь своими выигрышами в социальных сетях</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
            <p>Создайте группу или канал для обсуждения стратегий</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
            <p>Покажите друзьям, как работает платформа</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
            <p>Используйте промокоды и специальные предложения</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ReferralsPage; 