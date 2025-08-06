import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from 'react-query';
import { useAuthStore } from '../stores/authStore';
import { useTelegramWebApp } from '../hooks/useTelegramWebApp';
import { Package, Coins, Star, Zap, Eye } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface Case {
  id: number;
  name: string;
  description: string;
  image_url: string;
  price_ezcoin: number;
  rarity: string;
}

interface NFT {
  id: number;
  name: string;
  description: string;
  image_url: string;
  rarity: string;
  value_ezcoin: number;
}

const CasesPage: React.FC = () => {
  const { user } = useAuthStore();
  const { hapticFeedback } = useTelegramWebApp();
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [isOpening, setIsOpening] = useState(false);
  const [openedNFT, setOpenedNFT] = useState<NFT | null>(null);

  // Загружаем кейсы
  const { data: cases, isLoading } = useQuery('cases', async () => {
    const response = await axios.get('/api/cases');
    return response.data;
  });

  const openCase = async (caseItem: Case) => {
    if (!user) {
      toast.error('Необходимо авторизоваться');
      return;
    }

    if (user.balance_ezcoin < caseItem.price_ezcoin) {
      toast.error('Недостаточно средств');
      return;
    }

    setIsOpening(true);
    hapticFeedback('medium');

    try {
      const response = await axios.post(`/api/cases/${caseItem.id}/open`);
      const { nft, new_balance } = response.data;

      setOpenedNFT(nft);
      setSelectedCase(caseItem);

      // Обновляем баланс пользователя
      // В реальном приложении здесь нужно обновить store

      toast.success(`Вы получили ${nft.name}!`);
      hapticFeedback('heavy');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Ошибка при открытии кейса');
    } finally {
      setIsOpening(false);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400';
      case 'rare': return 'text-blue-400';
      case 'epic': return 'text-purple-400';
      case 'legendary': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'common': return '⭐';
      case 'rare': return '⭐⭐';
      case 'epic': return '⭐⭐⭐';
      case 'legendary': return '⭐⭐⭐⭐';
      default: return '⭐';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">📦 Кейсы</h1>
        <p className="text-gray-400">Открывайте кейсы и получайте уникальные NFT</p>
      </div>

      {/* Cases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cases?.map((caseItem: Case) => (
          <motion.div
            key={caseItem.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-surface rounded-xl border border-gray-700 overflow-hidden hover:border-purple-500 transition-all duration-300"
          >
            {/* Case Image */}
            <div className="relative h-48 bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center">
              <div className="text-6xl">📦</div>
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getRarityColor(caseItem.rarity)}`}>
                  {getRarityIcon(caseItem.rarity)}
                </span>
              </div>
            </div>

            {/* Case Info */}
            <div className="p-6">
              <h3 className="text-white font-semibold text-lg mb-2">{caseItem.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{caseItem.description}</p>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Coins className="w-4 h-4 text-yellow-400" />
                  <span className="text-white font-semibold">{caseItem.price_ezcoin}</span>
                  <span className="text-gray-400 text-sm">$EZCOIN</span>
                </div>
                <span className={`text-sm font-medium ${getRarityColor(caseItem.rarity)}`}>
                  {caseItem.rarity.toUpperCase()}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedCase(caseItem)}
                  className="flex-1 flex items-center justify-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  <Eye className="w-4 h-4" />
                  <span>Просмотр</span>
                </button>
                <button
                  onClick={() => openCase(caseItem)}
                  disabled={isOpening || !user || user.balance_ezcoin < caseItem.price_ezcoin}
                  className="flex-1 flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  {isOpening ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Zap className="w-4 h-4" />
                  )}
                  <span>{isOpening ? 'Открытие...' : 'Открыть'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Case Details Modal */}
      <AnimatePresence>
        {selectedCase && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedCase(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-surface rounded-xl p-6 max-w-md w-full border border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">📦</span>
                </div>
                <h3 className="text-white font-bold text-xl mb-2">{selectedCase.name}</h3>
                <p className="text-gray-400 mb-4">{selectedCase.description}</p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Цена:</span>
                    <span className="text-white font-semibold">{selectedCase.price_ezcoin} $EZCOIN</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Редкость:</span>
                    <span className={`font-semibold ${getRarityColor(selectedCase.rarity)}`}>
                      {getRarityIcon(selectedCase.rarity)} {selectedCase.rarity.toUpperCase()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    openCase(selectedCase);
                    setSelectedCase(null);
                  }}
                  disabled={isOpening || !user || user.balance_ezcoin < selectedCase.price_ezcoin}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200"
                >
                  {isOpening ? 'Открытие...' : 'Открыть кейс'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Opened NFT Modal */}
      <AnimatePresence>
        {openedNFT && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setOpenedNFT(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-surface rounded-xl p-6 max-w-md w-full border border-gray-700 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🎁</span>
              </div>
              <h3 className="text-white font-bold text-xl mb-2">Поздравляем!</h3>
              <p className="text-gray-400 mb-4">Вы получили:</p>
              
              <div className="bg-gray-800 rounded-lg p-4 mb-4">
                <h4 className="text-white font-semibold text-lg mb-2">{openedNFT.name}</h4>
                <p className="text-gray-400 text-sm mb-3">{openedNFT.description}</p>
                <div className="flex justify-between items-center">
                  <span className={`font-semibold ${getRarityColor(openedNFT.rarity)}`}>
                    {getRarityIcon(openedNFT.rarity)} {openedNFT.rarity.toUpperCase()}
                  </span>
                  <span className="text-white font-semibold">{openedNFT.value_ezcoin} $EZCOIN</span>
                </div>
              </div>

              <button
                onClick={() => setOpenedNFT(null)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200"
              >
                Отлично!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CasesPage; 