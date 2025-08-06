# Используем официальный Node.js образ
FROM node:20

# Рабочая директория внутри контейнера
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальной код проекта
COPY . .

# Собираем React-приложение
RUN npm run build

# Устанавливаем serve для запуска build
RUN npm install -g serve

# Открываем порт 3000 (для Vercel по умолчанию)
EXPOSE 3000

# Команда запуска
CMD ["serve", "-s", "build", "-l", "3000"]
