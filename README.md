# Приложение Next.js (Auth + Reviews)

Фронтенд на Next.js с формами регистрации и логина, списком пользователей и списком отзывов.

## Что нужно для работы

- Node.js 18+ (рекомендуется 20+)
- npm
- Запущенный backend API на `http://localhost:3000/api`

Приложение ожидает, что API доступно по этим endpoint:

- `POST /auth/register`
- `POST /auth/login`
- `GET /users`
- `GET /users/me`
- `GET /reviews`

## Установка и запуск

1. Установить зависимости:

```bash
npm install
```

2. Запустить dev-сервер:

```bash
npm run dev
```

3. Открыть приложение:

```text
http://localhost:8000
```

## Как пользоваться приложением

1. Перейти на `/register` и создать пользователя (`login` + `password`).
2. Перейти на `/login` и авторизоваться.
3. После логина сохраняется `httpOnly` cookie `auth`.
4. На `/users` отображается список пользователей (запрос с Bearer-токеном из cookie).
5. На `/` отображается список отзывов.
6. Кнопка `Выйти` удаляет cookie и переводит на `/login`.

## Полезные команды

```bash
npm run dev    # запуск в режиме разработки (порт 8000)
npm run build  # production-сборка
npm run start  # запуск production-сборки
npm run lint   # eslint --fix
```

## Примечание по доступу

Проверка авторизации в `middleware.ts` сейчас закомментирована, поэтому роуты не блокируются без логина на уровне middleware.
