import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../stores/authStore';
import { useTelegramWebApp } from '../hooks/useTelegramWebApp';
import { Gamepad2, Zap, Target, TrendingUp, Coins } from 'lucide-react';
import toast from 'react-hot-toast';

const GamesPage: React.FC = () => {
  const { user } = useAuthStore();
  const { hapticFeedback } = useTelegramWebApp();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const games = [
    {
      id: 'upgrades',
      name: 'Апгрейды',
      description: 'Крутите колесо и увеличивайте множитель!',
      icon: '🎰',
      color: 'from-purple-500 to-purple-600',
      minBet: 10,
      maxBet: 1000
    },
    {
      id: 'mines',
      name: 'Мины',
      description: 'Найдите все мины на поле и получите награду!',
      icon: '💣',
      color: 'from-red-500 to-red-600',
      minBet: 5,
      maxBet: 500
    },
    {
      id: 'crash',
      name: 'Краши',
      description: 'Следите за растущим множителем и выводите вовремя!',
      icon: '📈',
      color: 'from-green-500 to-green-600',
      minBet: 1,
      maxBet: 100
    }
  ];

  const startGame = (gameId: string) => {
    if (!user) {
      toast.error('Необходимо авторизоваться');
      return;
    }

    hapticFeedback('medium');
    setSelectedGame(gameId);
    toast.success(`Запуск игры: ${games.find(g => g.id === gameId)?.name}`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">🎯 Игры</h1>
        <p className="text-gray-400">Выберите игру и попробуйте удачу</p>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {games.map((game) => (
          <motion.div
            key={game.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-surface rounded-xl border border-gray-700 overflow-hidden hover:border-purple-500 transition-all duration-300"
          >
            {/* Game Header */}
            <div className={`bg-gradient-to-r ${game.color} p-6 text-center`}>
              <div className="text-4xl mb-2">{game.icon}</div>
              <h3 className="text-white font-bold text-xl">{game.name}</h3>
            </div>

            {/* Game Info */}
            <div className="p-6">
              <p className="text-gray-400 text-sm mb-4">{game.description}</p>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Мин. ставка:</span>
                  <span className="text-white font-semibold">{game.minBet} $EZCOIN</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Макс. ставка:</span>
                  <span className="text-white font-semibold">{game.maxBet} $EZCOIN</span>
                </div>
              </div>

              <button
                onClick={() => startGame(game.id)}
                disabled={!user}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Zap className="w-4 h-4" />
                <span>Играть</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Game Demo */}
      {selectedGame && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface rounded-xl p-6 border border-gray-700"
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              {games.find(g => g.id === selectedGame)?.name}
            </h2>
            <p className="text-gray-400 mb-6">
              Демо-версия игры. В полной версии здесь будет интерактивная игра.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-800 rounded-lg p-4 text-center">
                <Target className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <p className="text-white font-semibold">Точность</p>
                <p className="text-gray-400 text-sm">85%</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 text-center">
                <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-white font-semibold">Множитель</p>
                <p className="text-gray-400 text-sm">2.5x</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 text-center">
                <Coins className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <p className="text-white font-semibold">Выигрыш</p>
                <p className="text-gray-400 text-sm">250 $EZCOIN</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedGame(null)}
              className="bg-gray-600 hover:bg-gray-500 text-white py-2 px-6 rounded-lg font-semibold transition-colors duration-200"
            >
              Закрыть
            </button>
          </div>
        </motion.div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface rounded-xl p-4 text-center border border-gray-700">
          <Gamepad2 className="w-8 h-8 text-purple-400 mx-auto mb-2" />
          <p className="text-white font-bold text-lg">1,234</p>
          <p className="text-gray-400 text-sm">Игр сыграно</p>
        </div>
        <div className="bg-surface rounded-xl p-4 text-center border border-gray-700">
          <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <p className="text-white font-bold text-lg">5.2x</p>
          <p className="text-gray-400 text-sm">Макс. множитель</p>
        </div>
        <div className="bg-surface rounded-xl p-4 text-center border border-gray-700">
          <Coins className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
          <p className="text-white font-bold text-lg">12,345</p>
          <p className="text-gray-400 text-sm">Выиграно $EZCOIN</p>
        </div>
        <div className="bg-surface rounded-xl p-4 text-center border border-gray-700">
          <Zap className="w-8 h-8 text-blue-400 mx-auto mb-2" />
          <p className="text-white font-bold text-lg">67%</p>
          <p className="text-gray-400 text-sm">Процент побед</p>
        </div>
      </div>
    </div>
  );
};

export default GamesPage; 