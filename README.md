# Marketplace Microservices System

## 1. Название и назначение сервисов

Данный проект представляет собой **микросервисную архитектуру интернет-магазина**, включающую несколько независимых сервисов:

- **USER Service**
- **SELLER Service**
- **ADMIN Service**
- **AUTH Service (Login/Registration)**

Каждый сервис отвечает за свою бизнес-логику и взаимодействует с другими через API.

---

# USER Service

## Назначение

Сервис для работы пользователей с маркетплейсом.

### Основные функции

- управление корзиной
- оформление заказов
- просмотр истории заказов
- получение информации о товарах (через Seller Service)

---

# SELLER Service

## Назначение

Сервис управления товарами и продавцами.

### Основные функции

- создание и управление товарами
- управление каталогом
- предоставление информации о товарах USER Service
- подтверждение заказов
- анализ статистики

### Возможности

- создание, редактирование и удаление товаров
- получение статистики по продажам
- работа с поступившими заказами

---

# 🛠 ADMIN Service

## Назначение

Сервис администрирования платформы.

### Основные функции

- управление пользователями

### Возможности

- будаление и редактирование пользователей

---

# 🔐 AUTH Service (Login / Registration)

## Назначение

Сервис аутентификации и авторизации.

### Основные функции

- регистрация пользователей
- вход в систему
- выдача JWT токенов
- обновление токенов (refresh)
- управление сессиями

### Возможности

- разграничение ролей (user / seller / admin)

---

# 🧩 Архитектура и зависимости

## Общая архитектура

- Микросервисная архитектура
- REST API взаимодействие
- JWT авторизация

---

## Backend технологии

- FastAPI
- SQLAlchemy 2.0 (async)
- asyncpg
- PostgreSQL
- Alembic
- Pydantic v2
- python-jose (JWT)
- httpx
- pytest / pytest-asyncio

---

## Frontend технологии

- React 18
- TypeScript
- Redux Toolkit + RTK Query
- Material UI (MUI)
- Vite
- Vitest + Testing Library

---

# Способы запуска

## Запуск через Docker (рекомендуется)

```bash
docker compose up --build
```

---

## Локальный запуск
### USER Service
#### Frontend
```
cd user-frontend
yarn install
yarn dev
```
#### Backend
```
cd back
puthon -m venv venv
source venv/bin/activate
pip install -r requirements.txt
alembic init alembic
alembic revision --autogenerate -m "init"
alembic upgrade head
uvicorn src.app.application:get_app --factory --reload --host 0.0.0.0 --port 8001
```

### SELLER Service

#### Frontend
```
cd seller-frontend
yarn install
yarn dev
```
#### Backend

```
cd back
puthon -m venv venv
source venv/bin/activate
pip install -r requirements.txt
alembic init alembic
alembic revision --autogenerate -m "init"
alembic upgrade head
uvicorn src.app.application:get_app --factory --reload --host 0.0.0.0 --port 8002
```

### ADMIN Service

#### Frontend
```
cd admin-frontend
yarn install
yarn dev
```
#### Backend

```
cd back
puthon -m venv venv
source venv/bin/activate
pip install -r requirements.txt
alembic init alembic
alembic revision --autogenerate -m "init"
alembic upgrade head
uvicorn src.app.application:get_app --factory --reload --host 0.0.0.0 --port 8004
```


# API Документация
USER	http://localhost:8001/#docs
SELLER	http://localhost:8002/#docs
ADMIN	http://localhost:8004/#docs

# Тестирование
#### Backend
```
pytest
```
#### Frontend
```
yarn test
```

# Контакты и поддержка
Авторы: Новиков П.А., Виницкий Е.Р., Селивон С.И. | ПИН-36
GitHub Новикова П.А.: https://github.com/Psinavkvadrate
GitHub Виницкого Е.Р.: https://github.com/withFaithinFuture
GitHub Селивон С.И.: https://github.com/SofyaSelivon
Telegram: @psina_v_kvadrate
