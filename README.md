# Nedviga.CRM — Web (Refine + Ant Design)

Веб-версия CRM для десктопа. Вход по **email + паролю** (задаётся в мобильном приложении → «Защитите аккаунт»).

Стек: React + Vite + **Refine** + **Ant Design** + REST-провайдер к нашему API (`nedviga.rest`).

## Запуск

```bash
npm install
cp .env.example .env          # VITE_API_URL=https://nedviga.rest (или http://localhost:4000)
npm run dev                    # http://localhost:5173
```

## Деплой на Vercel (web.nedviga.io)

1. Add New → Project → Import `nedviga-web`. Framework: **Vite** (всё в `vercel.json`).
2. Environment Variables: `VITE_API_URL` = `https://nedviga.rest`.
3. Domains → `web.nedviga.io`.

## Разделы

Обзор · Объекты (CRUD) · Клиенты (CRUD) · Сделки · Сотрудники (+инвайт-ссылка).

Данные и авторизация — общие с мобильным приложением (одна БД).
