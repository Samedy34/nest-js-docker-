# Используем Node.js образ
FROM node:20

# Создаем рабочую директорию
WORKDIR /usr/src/app

# Копируем файлы package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь проект в контейнер
COPY . .

# Сборка приложения
RUN npm run build

# Экспонируем порт
EXPOSE 3000

# Команда для запуска приложения
CMD ["npm", "run", "start:dev"]
