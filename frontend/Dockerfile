# Используем Node.js 18
FROM node:18

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package*.json ./
RUN npm install

# Копируем всё остальное
COPY . .

# Собираем проект
RUN npm run build

# Устанавливаем serve и запускаем
RUN npm install -g serve
CMD ["serve", "-s", "build", "-l", "3000"]
