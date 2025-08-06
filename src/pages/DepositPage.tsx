import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../stores/authStore';
import { useTelegramWebApp } from '../hooks/useTelegramWebApp';
import { CreditCard, Coins, Zap, Copy, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

const DepositPage: React.FC = () => {
  const { user } = useAuthStore();
  const { hapticFeedback } = useTelegramWebApp();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [amount, setAmount] = useState('');

  const depositMethods = [
    {
      id: 'ton',
      name: 'TON',
      description: 'Пополнение через CryptoBot или Tonkeeper',
      icon: '💎',
      color: 'from-blue-500 to-blue-600',
      minAmount: 10,
      fee: '0%'
    },
    {
      id: 'card',
      name: 'Банковская карта',
      description: 'Visa, Mastercard, МИР',
      icon: '💳',
      color: 'from-green-500 to-green-600',
      minAmount: 10,
      fee: '2.5%'
    },
    {
      id: 'apple',
      name: 'Apple Pay',
      description: 'Для iOS устройств',
      icon: '🍎',
      color: 'from-gray-500 to-gray-600',
      minAmount: 10,
      fee: '1%'
    },
    {
      id: 'google',
      name: 'Google Pay',
      description: 'Для Android устройств',
      icon: '🤖',
      color: 'from-purple-500 to-purple-600',
      minAmount: 10,
      fee: '1%'
    },
    {
      id: 'stars',
      name: 'Telegram Stars',
      description: 'Внутренняя валюта Telegram',
      icon: '⭐',
      color: 'from-yellow-500 to-yellow-600',
      minAmount: 10,
      fee: '0%'
    }
  ];

  const handleDeposit = () => {
    if (!amount || parseFloat(amount) < 10) {
      toast.error('Минимальная сумма пополнения: 10 $EZCOIN');
      return;
    }

    if (!selectedMethod) {
      toast.error('Выберите способ пополнения');
      return;
    }

    hapticFeedback('medium');
    toast.success(`Запрос на пополнение ${amount} $EZCOIN отправлен!`);
    // В реальном приложении здесь будет интеграция с платежными системами
  };

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast.success('Адрес скопирован!');
    hapticFeedback('light');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">💳 Пополнить баланс</h1>
        <p className="text-gray-400">Выберите удобный способ пополнения</p>
      </div>

      {/* Current Balance */}
      {user && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface rounded-xl p-6 border border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Текущий баланс</p>
              <p className="text-white font-bold text-2xl">{user.balance_ezcoin.toFixed(2)} $EZCOIN</p>
            </div>
            <Coins className="w-8 h-8 text-yellow-400" />
          </div>
        </motion.div>
      )}

      {/* Amount Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-surface rounded-xl p-6 border border-gray-700"
      >
        <h3 className="text-white font-semibold text-lg mb-4">Сумма пополнения</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Сумма в $EZCOIN</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Введите сумму (мин. 10)"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
            />
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {[50, 100, 250, 500, 1000, 2500].map((value) => (
              <button
                key={value}
                onClick={() => setAmount(value.toString())}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-white transition-colors duration-200"
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Payment Methods */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-white font-semibold text-lg mb-4">Способы пополнения</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {depositMethods.map((method) => (
            <motion.div
              key={method.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedMethod(method.id)}
              className={`bg-surface rounded-xl border cursor-pointer transition-all duration-300 ${
                selectedMethod === method.id
                  ? 'border-purple-500 bg-purple-500/10'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="p-6">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${method.color} rounded-lg flex items-center justify-center text-white text-2xl`}>
                    {method.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-semibold text-lg">{method.name}</h4>
                    <p className="text-gray-400 text-sm">{method.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-gray-400 text-xs">Мин: {method.minAmount} $EZCOIN</span>
                      <span className="text-gray-400 text-xs">Комиссия: {method.fee}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* TON Address (if selected) */}
      {selectedMethod === 'ton' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface rounded-xl p-6 border border-gray-700"
        >
          <h3 className="text-white font-semibold text-lg mb-4">💎 Пополнение через TON</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Адрес кошелька</label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value="EQD...ABC123"
                  readOnly
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white font-mono"
                />
                <button
                  onClick={() => copyAddress('EQD...ABC123')}
                  className="px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <p className="text-yellow-400 text-sm">
                ⚠️ Отправляйте только TON на этот адрес. Другие токены будут потеряны.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Deposit Button */}
      {selectedMethod && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <button
            onClick={handleDeposit}
            disabled={!amount || parseFloat(amount) < 10}
            className="w-full max-w-md bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-4 px-8 rounded-lg font-semibold text-lg transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <Zap className="w-5 h-5" />
            <span>Пополнить {amount} $EZCOIN</span>
          </button>
        </motion.div>
      )}

      {/* Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-800 rounded-xl p-6 border border-gray-700"
      >
        <h3 className="text-white font-semibold text-lg mb-4">ℹ️ Информация</h3>
        <div className="space-y-3 text-sm text-gray-400">
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
            <p>Минимальная сумма пополнения: 10 $EZCOIN</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
            <p>Пополнение через TON и Telegram Stars без комиссии</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
            <p>Средства зачисляются в течение 1-5 минут</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
            <p>При возникновении проблем обращайтесь в поддержку</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DepositPage; 