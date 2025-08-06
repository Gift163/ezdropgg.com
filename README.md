# 🟣 EZDROP — Telegram Mini App + WebApp + Telegram Bot

## 📌 Описание проекта

EZDROP — это игровая Telegram Mini App с Web-интерфейсом, которая объединяет механики кейсов, азартных игр, NFT, токенов, реферальной системы и маркетплейса. Проект вдохновлён такими продуктами, как Hamster Kombat, Blum, Case Battle, CSGO Empire и OpenSea.

## 💠 Основные функции

- **Кейсы**: Открытие кейсов с NFT-предметами
- **Игры**: Апгрейды, Мины, Краши
- **Маркетплейс**: Покупка/продажа NFT
- **Внутренняя валюта**: $EZCOIN для игр, $EZDROP для вывода
- **Реферальная система**: Награды за приглашения
- **Пополнение**: TON, банковские карты, Google Pay/Apple Pay, Telegram Stars

## ⚙️ Технологический стек

- **Frontend**: React.js, TypeScript, Tailwind CSS
- **Backend**: Python Flask
- **База данных**: SQLite/PostgreSQL
- **Telegram Bot**: aiogram 2.x
- **Хостинг**: Vercel (WebApp), Railway (Bot)

## 🚀 Быстрый старт

### Установка зависимостей

```bash
# Frontend
cd frontend
npm install

# Backend
cd backend
pip install -r requirements.txt
```

### Запуск разработки

```bash
# Frontend (порт 3000)
cd frontend
npm run dev

# Backend (порт 5000)
cd backend
python app.py
```

## 📁 Структура проекта

```
EZDROP.com/
├── frontend/          # React WebApp
├── backend/           # Flask API
├── bot/              # Telegram Bot
├── database/         # Миграции и схемы
├── docs/             # Документация
└── assets/           # Статические файлы
```

## 🔐 Безопасность

- Проверка баланса перед выводом
- Автоматическое управление лимитами
- Защита от мошенничества

## 🌐 Поддерживаемые языки

- 🇺🇸 Английский
- 🇷🇺 Русский

## 📞 Поддержка

Для вопросов и предложений обращайтесь к команде разработки. 