import { NextRequest, NextResponse } from "next/server";
import { createTransaction } from "@/lib/payments";

export const runtime = "nodejs";

/**
 * Опциональный server-side путь. По умолчанию используем Paddle.js overlay на клиенте
 * (см. src/app/page.tsx) с NEXT_PUBLIC_PADDLE_PRICE_ID и customData { order_id }.
 * Этот роут — если хочешь создавать транзакцию на сервере.
 */
export async function POST(req: NextRequest) {
  const { orderId } = await req.json();
  const txn = await createTransaction(process.env.NEXT_PUBLIC_PADDLE_PRICE_ID!, orderId);
  return NextResponse.json({ txn });
}
