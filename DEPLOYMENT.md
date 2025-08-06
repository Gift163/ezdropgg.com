# Деплой EZDROP на Vercel

## Подготовка к деплою

### 1. Убедитесь, что все файлы закоммичены в Git

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Проверьте структуру проекта

```
EZDROPGG.com/
├── frontend/
│   ├── package.json
│   ├── public/
│   └── src/
├── backend/
├── bot/
├── package.json
├── vercel.json
└── .gitignore
```

## Деплой на Vercel

### Способ 1: Через Vercel CLI

1. Установите Vercel CLI:
```bash
npm i -g vercel
```

2. Войдите в аккаунт:
```bash
vercel login
```

3. Деплой:
```bash
vercel
```

### Способ 2: Через GitHub Integration

1. Зайдите на [vercel.com](https://vercel.com)
2. Нажмите "New Project"
3. Подключите ваш GitHub репозиторий
4. Настройте проект:
   - **Framework Preset**: Other
   - **Root Directory**: `./frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

### Способ 3: Прямой деплой

1. Перетащите папку `frontend` на [vercel.com](https://vercel.com)
2. Vercel автоматически определит React приложение

## Настройка переменных окружения

В Vercel Dashboard → Settings → Environment Variables добавьте:

```
REACT_APP_API_URL=https://your-backend-url.com
REACT_APP_TELEGRAM_BOT_TOKEN=your_bot_token
```

## Возможные проблемы и решения

### Проблема: Build fails
**Решение**: 
- Проверьте, что все зависимости установлены
- Убедитесь, что Node.js версии 18+
- Проверьте логи сборки в Vercel Dashboard

### Проблема: 404 ошибки
**Решение**:
- Убедитесь, что `vercel.json` правильно настроен
- Проверьте роутинг в React Router

### Проблема: API не работает
**Решение**:
- Проверьте переменные окружения
- Убедитесь, что backend развернут отдельно
- Проверьте CORS настройки

### Проблема: Telegram WebApp не работает
**Решение**:
- Убедитесь, что домен добавлен в BotFather
- Проверьте HTTPS (обязательно для Telegram WebApp)
- Проверьте инициализацию Telegram WebApp

## Проверка деплоя

1. Откройте ваш домен на Vercel
2. Проверьте консоль браузера на ошибки
3. Протестируйте основные функции
4. Проверьте работу в Telegram

## Обновление деплоя

После изменений в коде:

```bash
git add .
git commit -m "Update app"
git push origin main
```

Vercel автоматически пересоберет и развернет приложение.

## Мониторинг

- **Vercel Analytics**: Включите в Dashboard
- **Error Tracking**: Настройте Sentry или аналогичный сервис
- **Performance**: Используйте Lighthouse для проверки производительности

## Поддержка

Если проблемы остаются:
1. Проверьте логи в Vercel Dashboard
2. Убедитесь, что локально все работает (`npm start`)
3. Проверьте совместимость версий Node.js
4. Обратитесь в Vercel Support 