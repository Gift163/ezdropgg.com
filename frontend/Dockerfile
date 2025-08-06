# Используем Node 18
FROM node:18

# Рабочая директория внутри контейнера
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальные файлы
COPY . .

# Билдим фронтенд (если у тебя React, Next.js и т.п.)
RUN npm run build

# Указываем порт
EXPOSE 3000

# Запускаем проект
CMD ["npm", "start"]
