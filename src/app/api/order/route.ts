import { NextRequest, NextResponse } from "next/server";
import { createDraftOrder } from "@/lib/db";
import { orderLimit } from "@/lib/ratelimit";
import { ACTIVE } from "@/products";

export const runtime = "nodejs";

// Создаёт draft-заказ из ввода пользователя (до оплаты). Возвращает order_id для checkout.
export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "anon";
  const { success } = await orderLimit.limit(ip);
  if (!success) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  const { input, lang } = await req.json();
  if (!input || typeof input !== "object") {
    return NextResponse.json({ error: "bad_input" }, { status: 400 });
  }
  const orderId = await createDraftOrder(ACTIVE, input, lang ?? "en");
  return NextResponse.json({ orderId });
}
