# ⚡ Быстрый старт EZDROP

## 🎯 Что это?

EZDROP — это игровая Telegram Mini App с кейсами, играми, NFT-маркетплейсом и реферальной системой.

## 🚀 Быстрый запуск

### 1. Клонирование и установка

```bash
# Клонируйте репозиторий
git clone <your-repo-url>
cd EZDROP.com

# Backend
cd backend
python -m venv venv
source venv/bin/activate  # или venv\Scripts\activate на Windows
pip install -r requirements.txt
cp env.example .env
# Отредактируйте .env файл
python app.py

# Frontend (в новом терминале)
cd frontend
npm install
cp env.example .env
# Отредактируйте .env файл
npm start

# Bot (в новом терминале)
cd bot
pip install -r requirements.txt
cp ../backend/env.example .env
# Отредактируйте .env файл
python bot.py
```

### 2. Настройка Telegram Bot

1. Создайте бота через @BotFather
2. Получите токен и добавьте в .env файлы
3. Настройте WebApp URL в BotFather

### 3. Доступ к приложению

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Telegram Bot: @your_bot_name

## 📱 Основные функции

- ✅ Кейсы с NFT
- ✅ Игры (Апгрейды, Мины, Краши)
- ✅ NFT маркетплейс
- ✅ Реферальная система
- ✅ Пополнение/вывод средств
- ✅ Telegram WebApp интеграция

## 🔧 Технологии

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Python Flask + SQLAlchemy
- **Bot**: aiogram 2.x
- **База данных**: SQLite/PostgreSQL
- **Хостинг**: Vercel + Railway

## 📞 Поддержка

При проблемах:
1. Проверьте логи
2. Убедитесь в правильности .env файлов
3. Проверьте подключение к базе данных

## 🎮 Демо

После запуска вы сможете:
- Открывать кейсы
- Играть в мини-игры
- Покупать/продавать NFT
- Приглашать друзей
- Пополнять баланс

---

**Удачной разработки! 🚀** 