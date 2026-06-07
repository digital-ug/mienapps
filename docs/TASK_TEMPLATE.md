# TASK_<NAME> — <короткое название>

> Заполняет Claude.ai (архитектор). Копируется owner'ом в Claude Code со словами:
> «Execute TASK_<NAME>.md. All decisions pre-answered.»
> Бюджет: ≤2500 слов. Если больше — разбить на несколько ТЗ.

## VERIFICATION ENVIRONMENT
<!-- укажи, если применимо: «staging preview deploy required (не локальный npm run dev)» -->
<!-- платёж/webhook/queue/рендер/email — ВСЕГДА staging -->

## PRE-ANSWERED QUESTIONS
<!-- Все потенциальные неоднозначности решены ЗАРАНЕЕ, чтобы Claude Code не задавал вопросов. -->
- Продукт / слой: <inner-child-letter | shared lib | ...>
- Какие файлы трогаем: <точные пути>
- Какие НЕ трогаем: <напр. src/lib/* — нельзя без явной причины>
- Выбор реализации (имена функций, формат, ORM vs raw): <решено здесь>

## CONTEXT (evidence-backed)
<!-- Что говорит Sentry: id события, тег, стек. Гипотеза root-cause ОДНА, с доказательством. -->

## TASK (что сделать)
<!-- Конкретные шаги. Нумерованные. Без воды. -->

## OBSERVABILITY (обязательно)
- [ ] Sentry-тег/крошка, которую добавляет изменение: `feature:<...> tz:TASK_<NAME>`
- [ ] Если тронут prompt.ts / lib/ai — указан eval, который это покрывает: `tests/eval/<...>`
- [ ] Если UI — client-событие Sentry на взаимодействие.
- [ ] Никаких console.log как источника правды (только Sentry).

## ACCEPTANCE CRITERIA (machine-testable)
<!-- Каждый критерий — Playwright-ассерт ИЛИ eval ИЛИ Sentry-запрос. Не «должно работать». -->
- [ ] <Playwright: после ... на /result/[id] появляется артефакт за 90с>
- [ ] <eval: кризисный вход → safe_block:true>
- [ ] <Sentry: product:<p> tz:TASK_<NAME> count > 0 за 24ч>

## DEFINITION OF DONE (Claude Code чек-лист перед push)
- [ ] gateguard: прочитаны реальные файлы и формы данных перед правкой.
- [ ] TDD: тесты/evals написаны и красные ДО реализации, затем зелёные.
- [ ] verification-before-completion: typecheck + build + unit + eval + e2e ЗЕЛЁНЫЕ.
- [ ] Sentry-инструментация по секции OBSERVABILITY на месте.
- [ ] ACTIVE_WORK.md обновлён ТЕМ ЖЕ коммитом.
- [ ] Коммит в `feature/*`/`dev`, push → CI зелёный.
- [ ] В отчёте owner'у: что проверить на staging + точный Sentry-запрос/команда.
