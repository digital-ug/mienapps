# MienApps Starter

Шаблон импульсных AI-микро-продуктов. Форкается через **"Use this template"** → новый продукт за часы.

## Стек
Next.js (Vercel) · Supabase (DB + Storage) · Upstash (QStash очередь + Redis лимиты) ·
Paddle (Merchant of Record) · Resend (email) · AI: Claude + Gemini 2.5 Pro + Groq ·
Satori/`next/og` (рендер артефактов) · Replicate/Flux (опц.) · Sentry + PostHog.

## Быстрый старт
1. `npm install`
2. Скопируй `.env.example` → `.env.local`, заполни ключи.
3. Применить `supabase/migrations/0001_init.sql`; создать private Storage bucket `uploads`.
4. В Paddle: создать продукт+price → `NEXT_PUBLIC_PADDLE_PRICE_ID`; настроить webhook
   на `/api/webhook/payment` → `PADDLE_WEBHOOK_SECRET`.
5. QStash: задать `QSTASH_*`. Resend: домен + `RESEND_*`.
6. `npm run dev` → открой http://localhost:3000

## Структура
- `src/lib/*` — общий слой (НЕ трогать без причины): AI-gateway, payments (Paddle),
  queue (QStash), storage, email, ratelimit, artifact/render.
- `src/products/<slug>/*` — единственное, что меняется per-продукт.
- `src/app/api/*` — поток order→checkout→webhook→jobs→status→cleanup.

## Среды
`dev` → staging, `main` → production. Паблиш = merge `dev→main`. См. `CLAUDE.md`.

## Добавить продукт
Скопируй `src/products/inner-world-map/`, заполни 4 файла, зарегистрируй в `src/products/index.ts`.
