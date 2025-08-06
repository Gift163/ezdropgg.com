# Используем стабильную версию Python
FROM python:3.11-slim

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем зависимости
COPY requirements.txt .

# Устанавливаем зависимости
RUN pip install --no-cache-dir -r requirements.txt

# Копируем весь проект
COPY . .

# Открываем порт (если нужно)
EXPOSE 8080

# Команда запуска
CMD ["python", "backend/main.py"]
