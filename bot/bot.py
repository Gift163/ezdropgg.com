import asyncio
import logging
from aiogram import Bot, Dispatcher, types
from aiogram.contrib.fsm_storage.memory import MemoryStorage
from aiogram.dispatcher import FSMContext
from aiogram.dispatcher.filters.state import State, StatesGroup
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo
import os
from dotenv import load_dotenv
import requests
import json

# Загружаем переменные окружения
load_dotenv()

# Настройка логирования
logging.basicConfig(level=logging.INFO)

# Инициализация бота
bot = Bot(token=os.getenv('TELEGRAM_BOT_TOKEN'))
storage = MemoryStorage()
dp = Dispatcher(bot, storage=storage)

# URL API
API_URL = os.getenv('API_URL', 'http://localhost:5000')

# Состояния для FSM
class UserStates(StatesGroup):
    waiting_for_deposit = State()
    waiting_for_withdraw = State()

# Клавиатуры
def get_main_keyboard():
    keyboard = InlineKeyboardMarkup(row_width=2)
    keyboard.add(
        InlineKeyboardButton("🎮 Открыть WebApp", web_app=WebAppInfo(url=os.getenv('WEBAPP_URL', 'https://ezdrop.vercel.app'))),
        InlineKeyboardButton("💰 Баланс", callback_data="balance"),
        InlineKeyboardButton("📦 Кейсы", callback_data="cases"),
        InlineKeyboardButton("🎯 Игры", callback_data="games"),
        InlineKeyboardButton("🏪 Маркетплейс", callback_data="marketplace"),
        InlineKeyboardButton("👥 Рефералы", callback_data="referrals"),
        InlineKeyboardButton("💳 Пополнить", callback_data="deposit"),
        InlineKeyboardButton("💸 Вывести", callback_data="withdraw"),
        InlineKeyboardButton("📊 Статистика", callback_data="stats"),
        InlineKeyboardButton("❓ Помощь", callback_data="help")
    )
    return keyboard

def get_games_keyboard():
    keyboard = InlineKeyboardMarkup(row_width=2)
    keyboard.add(
        InlineKeyboardButton("🎰 Апгрейды", callback_data="game_upgrades"),
        InlineKeyboardButton("💣 Мины", callback_data="game_mines"),
        InlineKeyboardButton("📈 Краши", callback_data="game_crash"),
        InlineKeyboardButton("🔙 Назад", callback_data="main_menu")
    )
    return keyboard

def get_deposit_keyboard():
    keyboard = InlineKeyboardMarkup(row_width=2)
    keyboard.add(
        InlineKeyboardButton("💎 TON", callback_data="deposit_ton"),
        InlineKeyboardButton("💳 Банковская карта", callback_data="deposit_card"),
        InlineKeyboardButton("🍎 Apple Pay", callback_data="deposit_apple"),
        InlineKeyboardButton("🤖 Google Pay", callback_data="deposit_google"),
        InlineKeyboardButton("⭐ Telegram Stars", callback_data="deposit_stars"),
        InlineKeyboardButton("🔙 Назад", callback_data="main_menu")
    )
    return keyboard

# Обработчики команд
@dp.message_handler(commands=['start'])
async def cmd_start(message: types.Message):
    user = message.from_user
    
    # Приветственное сообщение
    welcome_text = f"""
🟣 Добро пожаловать в EZDROP!

Привет, {user.first_name}! 👋

🎮 EZDROP — это игровая платформа с кейсами, играми и NFT-маркетплейсом.

💰 Ваша валюта: $EZCOIN
🎯 Выводите в: $EZDROP (скоро!)

Выберите действие:
    """
    
    await message.answer(welcome_text, reply_markup=get_main_keyboard())

@dp.message_handler(commands=['help'])
async def cmd_help(message: types.Message):
    help_text = """
❓ Помощь по EZDROP

🎮 **Основные функции:**
• Кейсы — открывайте кейсы с NFT
• Игры — Апгрейды, Мины, Краши
• Маркетплейс — покупайте/продавайте NFT
• Рефералы — приглашайте друзей

💰 **Валюта:**
• $EZCOIN — игровая валюта
• $EZDROP — токен для вывода (скоро)

💳 **Пополнение:**
• TON (CryptoBot, Tonkeeper)
• Банковские карты
• Apple Pay / Google Pay
• Telegram Stars

🎯 **Вывод:**
• В токен $EZDROP (после релиза)
• Минимальная сумма: 1000 $EZCOIN

📞 Поддержка: @ezdrop_support
    """
    
    await message.answer(help_text, reply_markup=get_main_keyboard())

# Обработчики callback-запросов
@dp.callback_query_handler(lambda c: c.data == "balance")
async def process_balance(callback_query: types.CallbackQuery):
    try:
        # Получаем данные пользователя из API
        user_id = callback_query.from_user.id
        response = requests.get(f"{API_URL}/api/user/profile", 
                              headers={'Authorization': f'Bearer {get_user_token(user_id)}'})
        
        if response.status_code == 200:
            user_data = response.json()
            balance_text = f"""
💰 Ваш баланс:

💎 $EZCOIN: {user_data['balance_ezcoin']:.2f}
🟣 $EZDROP: {user_data['balance_ezdrop']:.2f}

💳 Пополнить: /deposit
💸 Вывести: /withdraw
            """
        else:
            balance_text = "❌ Ошибка получения баланса. Попробуйте позже."
        
        await callback_query.message.edit_text(balance_text, reply_markup=get_main_keyboard())
    except Exception as e:
        await callback_query.message.edit_text("❌ Ошибка получения баланса", reply_markup=get_main_keyboard())

@dp.callback_query_handler(lambda c: c.data == "cases")
async def process_cases(callback_query: types.CallbackQuery):
    try:
        response = requests.get(f"{API_URL}/api/cases")
        if response.status_code == 200:
            cases = response.json()
            cases_text = "📦 Доступные кейсы:\n\n"
            
            for case in cases[:5]:  # Показываем первые 5 кейсов
                cases_text += f"🎁 {case['name']}\n"
                cases_text += f"💰 Цена: {case['price_ezcoin']} $EZCOIN\n"
                cases_text += f"⭐ Редкость: {case['rarity']}\n\n"
            
            cases_text += "🎮 Откройте WebApp для покупки кейсов!"
        else:
            cases_text = "❌ Ошибка загрузки кейсов"
        
        await callback_query.message.edit_text(cases_text, reply_markup=get_main_keyboard())
    except Exception as e:
        await callback_query.message.edit_text("❌ Ошибка загрузки кейсов", reply_markup=get_main_keyboard())

@dp.callback_query_handler(lambda c: c.data == "games")
async def process_games(callback_query: types.CallbackQuery):
    games_text = """
🎯 Доступные игры:

🎰 **Апгрейды**
Крутите колесо и увеличивайте множитель!

💣 **Мины**
Найдите все мины на поле и получите награду!

📈 **Краши**
Следите за растущим множителем и выводите вовремя!

Выберите игру:
    """
    
    await callback_query.message.edit_text(games_text, reply_markup=get_games_keyboard())

@dp.callback_query_handler(lambda c: c.data == "marketplace")
async def process_marketplace(callback_query: types.CallbackQuery):
    marketplace_text = """
🏪 NFT Маркетплейс

Покупайте и продавайте NFT-предметы!

🎮 Откройте WebApp для доступа к маркетплейсу:
    """
    
    keyboard = InlineKeyboardMarkup()
    keyboard.add(InlineKeyboardButton("🏪 Открыть маркетплейс", 
                                     web_app=WebAppInfo(url=f"{os.getenv('WEBAPP_URL')}/marketplace")))
    keyboard.add(InlineKeyboardButton("🔙 Назад", callback_data="main_menu"))
    
    await callback_query.message.edit_text(marketplace_text, reply_markup=keyboard)

@dp.callback_query_handler(lambda c: c.data == "referrals")
async def process_referrals(callback_query: types.CallbackQuery):
    try:
        user_id = callback_query.from_user.id
        response = requests.get(f"{API_URL}/api/user/profile", 
                              headers={'Authorization': f'Bearer {get_user_token(user_id)}'})
        
        if response.status_code == 200:
            user_data = response.json()
            referral_text = f"""
👥 Реферальная программа

🔗 Ваша реферальная ссылка:
`https://t.me/ezdrop_bot?start={user_data['referral_code']}`

💰 Награды:
• 5 рефералов: 100 $EZCOIN
• 10 рефералов: 250 $EZCOIN
• 50 рефералов: 1500 $EZCOIN
• 100 рефералов: 3500 $EZCOIN
• 1000 рефералов: 50000 $EZCOIN

🎁 Каждый реферал получает бонус при регистрации!
            """
        else:
            referral_text = "❌ Ошибка получения реферальной информации"
        
        await callback_query.message.edit_text(referral_text, reply_markup=get_main_keyboard())
    except Exception as e:
        await callback_query.message.edit_text("❌ Ошибка получения реферальной информации", reply_markup=get_main_keyboard())

@dp.callback_query_handler(lambda c: c.data == "deposit")
async def process_deposit(callback_query: types.CallbackQuery):
    deposit_text = """
💳 Пополнение баланса

Выберите способ пополнения:

💎 **TON** — через CryptoBot или Tonkeeper
💳 **Банковская карта** — Visa/Mastercard
🍎 **Apple Pay** — для iOS устройств
🤖 **Google Pay** — для Android устройств
⭐ **Telegram Stars** — внутренняя валюта Telegram

Минимальная сумма: 10 $EZCOIN
    """
    
    await callback_query.message.edit_text(deposit_text, reply_markup=get_deposit_keyboard())

@dp.callback_query_handler(lambda c: c.data == "withdraw")
async def process_withdraw(callback_query: types.CallbackQuery):
    withdraw_text = """
💸 Вывод средств

💰 Вывод в токен $EZDROP (скоро!)

⚠️ Внимание:
• Минимальная сумма: 1000 $EZCOIN
• Вывод временно отключен до релиза токена
• Проверка через пул средств

🎯 Следите за обновлениями!
    """
    
    keyboard = InlineKeyboardMarkup()
    keyboard.add(InlineKeyboardButton("🔙 Назад", callback_data="main_menu"))
    
    await callback_query.message.edit_text(withdraw_text, reply_markup=keyboard)

@dp.callback_query_handler(lambda c: c.data == "stats")
async def process_stats(callback_query: types.CallbackQuery):
    stats_text = """
📊 Статистика EZDROP

🎮 Всего открыто кейсов: 1,234,567
💰 Общий объем торгов: 5,678,901 $EZCOIN
👥 Активных пользователей: 89,012
🏆 Самый дорогой NFT: 50,000 $EZCOIN

🎯 Ваша статистика:
• Открыто кейсов: 0
• Выиграно игр: 0
• Продано NFT: 0

🎮 Откройте WebApp для подробной статистики!
    """
    
    await callback_query.message.edit_text(stats_text, reply_markup=get_main_keyboard())

@dp.callback_query_handler(lambda c: c.data == "main_menu")
async def process_main_menu(callback_query: types.CallbackQuery):
    await cmd_start(callback_query.message)

# Обработчики игр
@dp.callback_query_handler(lambda c: c.data.startswith("game_"))
async def process_game(callback_query: types.CallbackQuery):
    game = callback_query.data.split("_")[1]
    
    if game == "upgrades":
        text = "🎰 Игра 'Апгрейды' доступна в WebApp!"
    elif game == "mines":
        text = "💣 Игра 'Мины' доступна в WebApp!"
    elif game == "crash":
        text = "📈 Игра 'Краши' доступна в WebApp!"
    else:
        text = "🎮 Игра доступна в WebApp!"
    
    keyboard = InlineKeyboardMarkup()
    keyboard.add(InlineKeyboardButton("🎮 Открыть WebApp", 
                                     web_app=WebAppInfo(url=os.getenv('WEBAPP_URL'))))
    keyboard.add(InlineKeyboardButton("🔙 Назад", callback_data="games"))
    
    await callback_query.message.edit_text(text, reply_markup=keyboard)

# Обработчики пополнения
@dp.callback_query_handler(lambda c: c.data.startswith("deposit_"))
async def process_deposit_method(callback_query: types.CallbackQuery):
    method = callback_query.data.split("_")[1]
    
    if method == "ton":
        text = "💎 Пополнение через TON\n\nИспользуйте CryptoBot или Tonkeeper для пополнения."
    elif method == "card":
        text = "💳 Пополнение картой\n\nПерейдите в WebApp для безопасного пополнения."
    elif method == "apple":
        text = "🍎 Apple Pay\n\nДоступно в WebApp для iOS устройств."
    elif method == "google":
        text = "🤖 Google Pay\n\nДоступно в WebApp для Android устройств."
    elif method == "stars":
        text = "⭐ Telegram Stars\n\nИспользуйте внутреннюю валюту Telegram."
    else:
        text = "💳 Выберите способ пополнения"
    
    keyboard = InlineKeyboardMarkup()
    keyboard.add(InlineKeyboardButton("🎮 Открыть WebApp", 
                                     web_app=WebAppInfo(url=f"{os.getenv('WEBAPP_URL')}/deposit")))
    keyboard.add(InlineKeyboardButton("🔙 Назад", callback_data="deposit"))
    
    await callback_query.message.edit_text(text, reply_markup=keyboard)

# Вспомогательные функции
def get_user_token(user_id):
    # В реальном проекте здесь должна быть логика получения токена пользователя
    # Пока возвращаем заглушку
    return "dummy_token"

# Обработчик ошибок
@dp.errors_handler()
async def errors_handler(update, exception):
    logging.error(f"Exception while handling an update: {exception}")
    return True

# Запуск бота
async def main():
    await dp.start_polling()

if __name__ == '__main__':
    asyncio.run(main()) 