# Используем официальный образ Python
FROM python:3.12-slim

# Устанавливаем рабочую директорию в контейнере
WORKDIR /app

# Устанавливаем зависимости для сборки и runtime
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Устанавливаем poetry
RUN pip install poetry

# Копируем файлы poetry в контейнер
COPY pyproject.toml poetry.lock* /app/

RUN poetry config virtualenvs.create false

RUN poetry install --no-interaction --no-ansi

# Копируем остальные файлы проекта
COPY . .

# Делаем скрипт запуска исполняемым
RUN chmod +x /app/start.sh

# Указываем, что контейнер будет слушать порт 8000
EXPOSE 8000

# Запускаем приложение с помощью скрипта start.sh
CMD ["/app/start.sh"]