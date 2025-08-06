import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../stores/authStore';
import { useTelegramWebApp } from '../hooks/useTelegramWebApp';
import { Wallet, Coins, Zap, AlertTriangle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const WithdrawPage: React.FC = () => {
  const { user } = useAuthStore();
  const { hapticFeedback } = useTelegramWebApp();
  const [amount, setAmount] = useState('');

  const handleWithdraw = () => {
    if (!amount || parseFloat(amount) < 1000) {
      toast.error('Минимальная сумма вывода: 1000 $EZCOIN');
      return;
    }

    if (!user || user.balance_ezcoin < parseFloat(amount)) {
      toast.error('Недостаточно средств');
      return;
    }

    hapticFeedback('medium');
    toast.success(`Запрос на вывод ${amount} $EZCOIN отправлен!`);
    // В реальном приложении здесь будет интеграция с выводом
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">💸 Вывести средства</h1>
        <p className="text-gray-400">Конвертация $EZCOIN в $EZDROP токены</p>
      </div>

      {/* Warning Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6"
      >
        <div className="flex items-start space-x-4">
          <AlertTriangle className="w-6 h-6 text-yellow-400 mt-1" />
          <div>
            <h3 className="text-yellow-400 font-semibold text-lg mb-2">⚠️ Внимание!</h3>
            <p className="text-yellow-300 text-sm mb-3">
              Вывод средств временно отключен до релиза токена $EZDROP. 
              Следите за обновлениями в нашем Telegram канале.
            </p>
            <div className="flex items-center space-x-2 text-yellow-300 text-sm">
              <Clock className="w-4 h-4" />
              <span>Ожидаемый релиз: Q1 2024</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Current Balance */}
      {user && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-surface rounded-xl p-6 border border-gray-700"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Баланс $EZCOIN</p>
                <p className="text-white font-bold text-2xl">{user.balance_ezcoin.toFixed(2)}</p>
              </div>
              <Coins className="w-8 h-8 text-yellow-400" />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Баланс $EZDROP</p>
                <p className="text-white font-bold text-2xl">{user.balance_ezdrop.toFixed(2)}</p>
              </div>
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Withdrawal Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-surface rounded-xl p-6 border border-gray-700"
      >
        <h3 className="text-white font-semibold text-lg mb-4">Вывод средств</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Сумма для вывода ($EZCOIN)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Введите сумму (мин. 1000)"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
            />
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {[1000, 2500, 5000, 10000, 25000, 50000].map((value) => (
              <button
                key={value}
                onClick={() => setAmount(value.toString())}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-white transition-colors duration-200"
              >
                {value.toLocaleString()}
              </button>
            ))}
          </div>

          {amount && (
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Сумма вывода:</span>
                  <span className="text-white font-semibold">{parseFloat(amount).toLocaleString()} $EZCOIN</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Комиссия (2%):</span>
                  <span className="text-red-400 font-semibold">{(parseFloat(amount) * 0.02).toFixed(2)} $EZCOIN</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Курс обмена:</span>
                  <span className="text-white font-semibold">1 $EZCOIN = 1 $EZDROP</span>
                </div>
                <div className="border-t border-gray-700 pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Получите:</span>
                    <span className="text-green-400 font-bold text-lg">
                      {(parseFloat(amount) * 0.98).toFixed(2)} $EZDROP
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Withdraw Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center"
      >
        <button
          onClick={handleWithdraw}
          disabled={true} // Временно отключен
          className="w-full max-w-md bg-gray-600 cursor-not-allowed text-white py-4 px-8 rounded-lg font-semibold text-lg flex items-center justify-center space-x-2"
        >
          <Wallet className="w-5 h-5" />
          <span>Вывод временно недоступен</span>
        </button>
      </motion.div>

      {/* Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-800 rounded-xl p-6 border border-gray-700"
      >
        <h3 className="text-white font-semibold text-lg mb-4">ℹ️ Информация о выводе</h3>
        <div className="space-y-3 text-sm text-gray-400">
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
            <p>Минимальная сумма вывода: 1,000 $EZCOIN</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
            <p>Комиссия за вывод: 2% от суммы</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
            <p>Время обработки: 1-24 часа</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
            <p>Вывод производится в токен $EZDROP в сети TON</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-red-400 rounded-full mt-2"></div>
            <p>Вывод временно отключен до релиза токена</p>
          </div>
        </div>
      </motion.div>

      {/* Token Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-6"
      >
        <h3 className="text-purple-400 font-semibold text-lg mb-4">🟣 О токене $EZDROP</h3>
        <div className="space-y-3 text-sm text-purple-300">
          <p>
            $EZDROP — это крипто-токен в сети TON, который будет использоваться для вывода средств 
            из игровой платформы EZDROP.
          </p>
          <p>
            Токен планируется к листингу на крупных биржах и будет иметь реальную стоимость.
          </p>
          <p>
            Следите за обновлениями в нашем Telegram канале для получения информации о релизе.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default WithdrawPage; 