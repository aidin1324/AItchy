#!/bin/bash
set -e

# Запускаем миграции Alembic
echo "Running database migrations..."
cd app
alembic upgrade head

# Заполняем начальные данные
echo "cd back"
cd ..
ls
echo "Initializing database with default data..."
PGPASSWORD=$POSTGRES_PASSWORD psql -h db -U postgres -d AItchy -a -f init_data.sql

cd app

# Запускаем приложение с Uvicorn
echo "Starting the application..."
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
