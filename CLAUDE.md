# MIENAPPS — CLAUDE.md (мозг репозитория для Claude Code)

> Claude Code читает это в начале каждой сессии. Это закон исполнителя. Дисциплина архитектора — в
> docs/RULES_FOR_CLAUDE_AI.md. Контекст — docs/PROJECT_CONTEXT.md. Наблюдаемость — docs/OBSERVABILITY.md.

## Что это
Монорепо `mienapps`. Один репо, продукт = папка `src/products/<slug>/`, общий код — `src/lib/*` (один раз).
НЕ трогай `src/lib/*` без явной причины из ТЗ — это ломает ВСЕ продукты сразу.

## Поток данных
order(draft) → Paddle overlay → webhook transaction.completed (verify подпись = источник правды) →
status=paid → enqueue(QStash) → /api/jobs/process (verify подпись) → pipeline(product): AI-gateway → строгий
JSON → renderArtifact(Satori→PNG) → Supabase Storage → status=done → Resend. /result/[id] поллит /api/status/[id].

## Закон выполнения ТЗ (полная версия — docs/SKILLS.md §4)
1. Прочитать RULES + PROJECT_CONTEXT + ACTIVE_WORK + ТЗ.
2. gateguard: расследовать ДО правки (реальные файлы + формы данных). Не предполагать структуру.
3. TDD: тесты + evals СНАЧАЛА (красные), потом реализация (зелёные).
4. Observability: Sentry-теги/крошки по секции OBSERVABILITY ТЗ.
5. verification-before-completion: typecheck + build + test:unit + test:eval + test:e2e — ВСЕ зелёные.
6. requesting/receiving-code-review: сабагент-ревью diff.
7. Коммит в feature/* или dev + обновить ACTIVE_WORK.md ТЕМ ЖЕ коммитом + push в dev → CI зелёный.
8. Отчёт owner'у: что проверить на staging + Sentry-запрос для валидации.
9. По команде: merge dev→main = публикация. Напрямую в main НЕ пушить.

## Добавить новый продукт
1. Скопируй `src/products/inner-world-map/` → `src/products/<slug>/`.
2. Заполни config.ts / prompt.ts / pipeline.ts / artifact.tsx.
3. Зарегистрируй в `src/products/index.ts`.
4. Добавь `tests/eval/<slug>/cases.ts` (вкл. кризисный вход → safe_block) и `tests/e2e/<slug>.spec.ts`.
5. Локально: `npm run dev` + `npm run test:eval`. Прогон сценария с тестовой оплатой Paddle (sandbox).

## Правила (всегда)
- Ключи API только на сервере (`runtime="nodejs"`). Никогда в клиенте/бандле.
- Загрузки пользователя удалять после генерации (storage.delete), expires_at = now()+30min.
- Каждый AI-вызов через `ai(task,args,orderId)` — он логирует стоимость в ai_calls.
- Роутинг: транскрибация/дёшево→Groq; Vision/длинный контекст/reason→Gemini 2.5 Pro; тон/эмпатия→Claude. Фолбэк вшит.
- Текстовые артефакты — Satori (детерминированно), НЕ генерацией картинки.
- Дисклеймер «развлекательный характер» в каждом артефакте. safe_block-ветка в промптах на кризис/минор/абьюз.
- Pay-first: генерация только из webhook оплаты, не из клиента. Идемпотентность по paddle_txn.
- Изменил prompt.ts / lib/ai → прогнать evals, приложить результат. Без зелёного eval не мёржить.
- Никаких console.log как источника правды о проде (Vercel stdout невидим owner'у — только Sentry).

## Sentry-теги на каждом событии (docs/OBSERVABILITY.md §2)
product · feature · path · tz. Уровни: exception=краш, warning=деградация, breadcrumb=рутина. Sample 1.0.

## Ветки/деплой
dev = staging, main = production. Фичи в feature/*, PR/merge в dev, проверка на staging, затем merge dev→main = публикация.
Миграции Supabase — сперва на staging-проекте, потом prod. Paddle: sandbox на staging, live на prod (env per environment).

## AUTO-UPDATE docs/ACTIVE_WORK.md (обязательно, тем же коммитом)
После каждой задачи: перенести строку «в работе» → «закрыто» с датой и «что важно знать» (root-cause, файлы,
тесты/evals, Sentry-тег, что owner'у проверить). Убрать из очереди если была. Конфликты — в раздел 4/6.
