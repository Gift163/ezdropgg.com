# 🚀 Настройка проекта EZDROP

## 📋 Требования

- Node.js 16+ 
- Python 3.8+
- Git
- Telegram Bot Token (от @BotFather)

## 🛠️ Установка и настройка

### 1. Клонирование репозитория

```bash
git clone <repository-url>
cd EZDROP.com
```

### 2. Настройка Backend (Flask API)

```bash
cd backend

# Создание виртуального окружения
python -m venv venv
source venv/bin/activate  # Linux/Mac
# или
venv\Scripts\activate  # Windows

# Установка зависимостей
pip install -r requirements.txt

# Настройка переменных окружения
cp env.example .env
# Отредактируйте .env файл с вашими настройками

# Инициализация базы данных
python app.py
```

### 3. Настройка Frontend (React)

```bash
cd frontend

# Установка зависимостей
npm install

# Настройка переменных окружения
cp env.example .env
# Отредактируйте .env файл

# Запуск в режиме разработки
npm start
```

### 4. Настройка Telegram Bot

```bash
cd bot

# Установка зависимостей
pip install -r requirements.txt

# Настройка переменных окружения
cp ../backend/env.example .env
# Отредактируйте .env файл

# Запуск бота
python bot.py
```

## 🔧 Конфигурация

### Переменные окружения Backend (.env)

```env
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///ezdrop.db
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
API_URL=http://localhost:5000
WEBAPP_URL=https://ezdrop.vercel.app
```

### Переменные окружения Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_TELEGRAM_BOT_TOKEN=your-telegram-bot-token
```

## 🚀 Развертывание

### Frontend (Vercel)

1. Подключите репозиторий к Vercel
2. Настройте переменные окружения в Vercel Dashboard
3. Деплой произойдет автоматически

### Backend (Railway/Heroku)

1. Подключите репозиторий к Railway/Heroku
2. Настройте переменные окружения
3. Укажите команду запуска: `python app.py`

### Telegram Bot (Railway)

1. Подключите папку `bot` к Railway
2. Настройте переменные окружения
3. Укажите команду запуска: `python bot.py`

## 📱 Telegram Bot настройка

1. Создайте бота через @BotFather
2. Получите токен бота
3. Настройте WebApp URL в BotFather:
   ```
   /setmenubutton
   @your_bot_name
   https://your-domain.vercel.app
   ```

## 🔐 Безопасность

- Используйте сильные секретные ключи
- Настройте HTTPS для продакшена
- Ограничьте доступ к API
- Используйте rate limiting
- Валидируйте все входные данные

## 📊 Мониторинг

- Настройте логирование
- Используйте Sentry для отслеживания ошибок
- Мониторьте производительность API
- Отслеживайте активность пользователей

## 🆘 Поддержка

При возникновении проблем:

1. Проверьте логи приложения
2. Убедитесь в правильности переменных окружения
3. Проверьте подключение к базе данных
4. Обратитесь к документации Telegram Bot API 