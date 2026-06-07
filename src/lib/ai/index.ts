import { db } from "../db";
import { callClaude } from "./claude";
import { callGemini } from "./gemini";
import { callGroq } from "./groq";
import { PRICE_PER_1K } from "./models";
import type { AIArgs, AIResult, Task } from "./types";

// Cheap-first роутинг: транскрибация/дёшево → groq; vision/длинный контекст → gemini; тон → claude.
const ROUTE: Record<Task, "groq" | "gemini" | "claude"> = {
  transcribe: "groq",
  cheap: "groq",
  vision: "gemini",
  reason: "gemini",
  empathy: "claude",
};

const CALLERS = { groq: callGroq, gemini: callGemini, claude: callClaude };

function estCents(r: AIResult): number {
  const p = (PRICE_PER_1K as any)[r.provider] ?? { in: 0, out: 0 };
  return ((r.inputTokens ?? 0) / 1000) * p.in + ((r.outputTokens ?? 0) / 1000) * p.out;
}

export async function ai(task: Task, args: AIArgs, orderId?: string): Promise<AIResult> {
  const primary = ROUTE[task];
  let res: AIResult;
  try {
    res = await CALLERS[primary](args);
  } catch (e) {
    // Фолбэк: claude↔gemini (vision остаётся на gemini).
    const fb = primary === "claude" ? "gemini" : "claude";
    res = await CALLERS[fb](args);
  }

  // Лог стоимости (не валим запрос, если лог не записался)
  try {
    await db.from("ai_calls").insert({
      order_id: orderId ?? null,
      provider: res.provider,
      model: res.model,
      input_tokens: res.inputTokens ?? null,
      output_tokens: res.outputTokens ?? null,
      cost_cents: estCents(res),
    });
  } catch {}

  return res;
}

// Удобный парсер строгого JSON-ответа модели.
export function parseJSON<T>(text: string): T {
  const cleaned = text.trim().replace(/^```json\s*/i, "").replace(/```$/i, "");
  return JSON.parse(cleaned) as T;
}
