import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../stores/authStore';
import { useTelegramWebApp } from '../hooks/useTelegramWebApp';
import { Store, Search, Filter, Coins, Star, Eye } from 'lucide-react';

const MarketplacePage: React.FC = () => {
  const { user } = useAuthStore();
  const { hapticFeedback } = useTelegramWebApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRarity, setSelectedRarity] = useState('all');

  // Демо данные NFT
  const nfts = [
    {
      id: 1,
      name: 'Cyber Sword',
      description: 'Легендарный меч из будущего',
      image_url: '/assets/nft1.png',
      rarity: 'legendary',
      value_ezcoin: 5000,
      owner: 'CyberGamer',
      is_for_sale: true,
      sale_price: 4500
    },
    {
      id: 2,
      name: 'Neon Shield',
      description: 'Защитный щит с неоновой подсветкой',
      image_url: '/assets/nft2.png',
      rarity: 'epic',
      value_ezcoin: 2500,
      owner: 'NeonMaster',
      is_for_sale: true,
      sale_price: 2200
    },
    {
      id: 3,
      name: 'Digital Crown',
      description: 'Корона цифрового короля',
      image_url: '/assets/nft3.png',
      rarity: 'rare',
      value_ezcoin: 1200,
      owner: 'CryptoKing',
      is_for_sale: false,
      sale_price: 0
    }
  ];

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

  const filteredNFTs = nfts.filter(nft => {
    const matchesSearch = nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         nft.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRarity = selectedRarity === 'all' || nft.rarity === selectedRarity;
    return matchesSearch && matchesRarity;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">🏪 Маркетплейс</h1>
        <p className="text-gray-400">Покупайте и продавайте NFT</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Поиск NFT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="text-gray-400 w-5 h-5" />
          <select
            value={selectedRarity}
            onChange={(e) => setSelectedRarity(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
          >
            <option value="all">Все редкости</option>
            <option value="common">Обычные</option>
            <option value="rare">Редкие</option>
            <option value="epic">Эпические</option>
            <option value="legendary">Легендарные</option>
          </select>
        </div>
      </div>

      {/* NFT Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNFTs.map((nft) => (
          <motion.div
            key={nft.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-surface rounded-xl border border-gray-700 overflow-hidden hover:border-purple-500 transition-all duration-300"
          >
            {/* NFT Image */}
            <div className="relative h-48 bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center">
              <div className="text-6xl">🎨</div>
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getRarityColor(nft.rarity)}`}>
                  {getRarityIcon(nft.rarity)}
                </span>
              </div>
              {!nft.is_for_sale && (
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                    Не продается
                  </span>
                </div>
              )}
            </div>

            {/* NFT Info */}
            <div className="p-6">
              <h3 className="text-white font-semibold text-lg mb-2">{nft.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{nft.description}</p>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Владелец:</span>
                  <span className="text-white font-medium">@{nft.owner}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Стоимость:</span>
                  <span className="text-white font-semibold">{nft.value_ezcoin} $EZCOIN</span>
                </div>
                {nft.is_for_sale && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Цена продажи:</span>
                    <span className="text-green-400 font-semibold">{nft.sale_price} $EZCOIN</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Редкость:</span>
                  <span className={`font-semibold ${getRarityColor(nft.rarity)}`}>
                    {getRarityIcon(nft.rarity)} {nft.rarity.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={() => hapticFeedback('light')}
                  className="flex-1 flex items-center justify-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  <Eye className="w-4 h-4" />
                  <span>Просмотр</span>
                </button>
                {nft.is_for_sale && (
                  <button
                    onClick={() => hapticFeedback('medium')}
                    disabled={!user || user.balance_ezcoin < nft.sale_price}
                    className="flex-1 flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    <Coins className="w-4 h-4" />
                    <span>Купить</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface rounded-xl p-4 text-center border border-gray-700">
          <Store className="w-8 h-8 text-purple-400 mx-auto mb-2" />
          <p className="text-white font-bold text-lg">12,345</p>
          <p className="text-gray-400 text-sm">Всего NFT</p>
        </div>
        <div className="bg-surface rounded-xl p-4 text-center border border-gray-700">
          <Coins className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
          <p className="text-white font-bold text-lg">5.6M</p>
          <p className="text-gray-400 text-sm">Общий объем $EZCOIN</p>
        </div>
        <div className="bg-surface rounded-xl p-4 text-center border border-gray-700">
          <Star className="w-8 h-8 text-blue-400 mx-auto mb-2" />
          <p className="text-white font-bold text-lg">1,234</p>
          <p className="text-gray-400 text-sm">Продано сегодня</p>
        </div>
        <div className="bg-surface rounded-xl p-4 text-center border border-gray-700">
          <Eye className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <p className="text-white font-bold text-lg">89,012</p>
          <p className="text-gray-400 text-sm">Просмотров</p>
        </div>
      </div>
    </div>
  );
};

export default MarketplacePage; 