-- MienApps starter — базовая схема (общая для всех продуктов)

create extension if not exists "pgcrypto";

create table if not exists orders (
  id          uuid primary key default gen_random_uuid(),
  product     text not null,                 -- 'inner-world-map' | 'ai-courtroom' | ...
  status      text not null default 'draft', -- draft|paid|processing|done|failed
  lang        text default 'en',
  input       jsonb,                          -- ввод пользователя (без сырой биометрии надолго)
  result      jsonb,                          -- { ...поля продукта, artifact_url }
  email       text,
  cost_cents  numeric default 0,
  paddle_txn  text,                           -- id транзакции Paddle (идемпотентность)
  created_at  timestamptz default now(),
  expires_at  timestamptz                     -- TTL для очистки загрузок
);
create index if not exists orders_status_idx on orders (status);
create unique index if not exists orders_paddle_txn_idx on orders (paddle_txn) where paddle_txn is not null;

create table if not exists ai_calls (         -- лог стоимости каждого AI-вызова
  id            bigserial primary key,
  order_id      uuid references orders(id) on delete set null,
  provider      text,
  model         text,
  input_tokens  int,
  output_tokens int,
  cost_cents    numeric,
  created_at    timestamptz default now()
);

-- Storage: создать private bucket 'uploads' в дашборде Supabase.
-- Очистка по expires_at делается из /api/cron/cleanup (дёргается cron-job.org).
