import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

const redis = Redis.fromEnv();

// Защита от абуза: N заказов с одного IP в окно времени.
export const orderLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "10 m"),
  prefix: "rl:order",
});

// Кэш результата по хешу входа: одинаковый ввод → не платим за модель дважды.
export async function cacheGet<T>(key: string): Promise<T | null> {
  return (await redis.get<T>(`cache:${key}`)) ?? null;
}
export async function cacheSet(key: string, value: unknown, ttlSec = 60 * 60 * 24) {
  await redis.set(`cache:${key}`, value, { ex: ttlSec });
}
