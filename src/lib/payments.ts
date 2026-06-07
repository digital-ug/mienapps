import crypto from "node:crypto";

/**
 * Paddle Billing.
 *
 * Поток (overlay checkout, рекомендуемый для импульсных продуктов):
 *  1. Клиент открывает Paddle.js overlay с priceId + customData { order_id }.
 *  2. Paddle проводит оплату и шлёт webhook 'transaction.completed' на /api/webhook/payment.
 *  3. Мы верифицируем подпись (verifyPaddleSignature) — это ЕДИНСТВЕННЫЙ источник правды
 *     об оплате (нельзя доверять редиректу на клиенте) — и ставим задачу в очередь.
 *
 * Webhook-подпись Paddle: заголовок `Paddle-Signature: ts=...;h1=...`.
 * h1 = HMAC-SHA256( `${ts}:${rawBody}` , PADDLE_WEBHOOK_SECRET ).
 */
export function verifyPaddleSignature(rawBody: string, signatureHeader: string | null): boolean {
  if (!signatureHeader) return false;
  const parts = Object.fromEntries(
    signatureHeader.split(";").map((p) => p.split("=") as [string, string])
  );
  const ts = parts["ts"];
  const h1 = parts["h1"];
  if (!ts || !h1) return false;

  const expected = crypto
    .createHmac("sha256", process.env.PADDLE_WEBHOOK_SECRET!)
    .update(`${ts}:${rawBody}`)
    .digest("hex");

  // timing-safe сравнение
  const a = Buffer.from(expected);
  const b = Buffer.from(h1);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// Достаём order_id и id транзакции из payload вебхука transaction.completed.
export function parsePaddleEvent(payload: any): {
  eventType: string;
  txnId: string | null;
  orderId: string | null;
  email: string | null;
} {
  const d = payload?.data ?? {};
  return {
    eventType: payload?.event_type ?? "",
    txnId: d?.id ?? null,
    orderId: d?.custom_data?.order_id ?? null,
    email: d?.customer?.email ?? d?.billing_details?.email ?? null,
  };
}

const PADDLE_API =
  process.env.PADDLE_ENV === "production"
    ? "https://api.paddle.com"
    : "https://sandbox-api.paddle.com";

// Опционально: server-side создание транзакции (если не хочешь overlay c priceId на клиенте).
export async function createTransaction(priceId: string, orderId: string) {
  const res = await fetch(`${PADDLE_API}/transactions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PADDLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: [{ price_id: priceId, quantity: 1 }],
      custom_data: { order_id: orderId },
    }),
  });
  if (!res.ok) throw new Error(`Paddle createTransaction failed: ${res.status}`);
  return res.json();
}
