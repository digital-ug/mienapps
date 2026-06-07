# MienApps Starter — инструкции для Claude Code

## Что это
Шаблон импульсных AI-микро-продуктов (Next.js на Vercel + Supabase + очередь + Paddle).
**Один продукт = одна папка в `src/products/<slug>/`.** Один репо = один продукт
(переменная `NEXT_PUBLIC_PRODUCT` указывает, какой продукт обслуживает деплой).

НЕ трогай `src/lib/*` без явной задачи — это общий слой (AI-gateway, платежи, очередь,
storage, email, rate-limit, рендер артефактов). Он один на все продукты.

## Архитектура потока
order(draft) → Paddle overlay checkout → webhook `transaction.completed` (verify подпись,
источник правды) → status=paid → enqueue(QStash) → `/api/jobs/process` (verify подпись)
→ pipeline продукта: AI-gateway → строгий JSON → renderArtifact(Satori→PNG) → Supabase Storage
→ status=done → Resend письмо. `/result/[id]` поллит `/api/status/[id]`.

## Добавить новый продукт
1. Скопируй `src/products/inner-world-map/` → `src/products/<slug>/`.
2. Заполни:
   - `config.ts` — slug, цена, заголовок, поля ввода.
   - `prompt.ts` — системный промпт + сборка user-сообщения + тип результата (строгий JSON).
   - `pipeline.ts` — оркестрация: input → ai(...) → parseJSON → renderArtifact → putArtifact.
   - `artifact.tsx` — Satori-шаблон (React→PNG), 1080×1350.
3. Зарегистрируй продукт в `src/products/index.ts` (PRODUCTS + импорт).
4. Локально: `npm run dev`, прогони сценарий с тестовой оплатой Paddle (sandbox).

## Правила (соблюдать всегда)
- Ключи API только на сервере (`runtime = "nodejs"` на роутах). Никогда в клиенте.
- Загрузки пользователя удалять после генерации (`deletePrefix(orderId)`), `expires_at = now()+30min`.
- Каждый AI-вызов идёт через `ai(task, args, orderId)` — он логирует стоимость в `ai_calls`.
- Роутинг: транскрибация/дёшево→Groq; Vision/длинный контекст/reason→Gemini 2.5 Pro;
  тон/эмпатия/копи→Claude. Фолбэк Claude↔Gemini вшит в gateway.
- Текстовые артефакты (карта/вердикт/постер) рендерить Satori (детерминированно), НЕ генерацией картинки.
- Дисклеймер «развлекательный характер» в каждом артефакте.
- Pay-first: генерация запускается только из webhook оплаты, не из клиента.
- Идемпотентность вебхука по `paddle_txn` (уже вшита в webhook-роут).

## Ветки и деплой (dev → prod)
- `dev` = staging, `main` = production.
- Фичи в `feature/*` → PR в `dev` → проверка на staging → merge `dev→main` = **публикация**.
- Миграции Supabase прогонять сперва на staging-проекте, потом на prod.
- Paddle: sandbox-ключи на staging, live — на prod (через env per environment).

## Модели
Строки моделей — в `src/lib/ai/models.ts`. Они версионно-зависимы: проверяй актуальные
перед релизом и правь в одном месте.
