import { NextRequest, NextResponse } from "next/server";
import { verifyPaddleSignature, parsePaddleEvent } from "@/lib/payments";
import { db, updateOrder } from "@/lib/db";
import { enqueueJob } from "@/lib/queue";

export const runtime = "nodejs";

// Источник правды об оплате. Verify подпись → status=paid → enqueue (идемпотентно по txnId).
export async function POST(req: NextRequest) {
  const raw = await req.text(); // ВАЖНО: сырое тело для HMAC
  const sig = req.headers.get("paddle-signature");
  if (!verifyPaddleSignature(raw, sig)) {
    return NextResponse.json({ error: "bad_signature" }, { status: 401 });
  }

  const evt = parsePaddleEvent(JSON.parse(raw));
  if (evt.eventType !== "transaction.completed" || !evt.orderId) {
    return NextResponse.json({ ok: true }); // игнорим прочие события
  }

  // Идемпотентность: если этот txn уже проведён — выходим.
  const { data: existing } = await db
    .from("orders").select("id,status").eq("paddle_txn", evt.txnId).maybeSingle();
  if (existing) return NextResponse.json({ ok: true, dedup: true });

  await updateOrder(evt.orderId, {
    status: "paid",
    email: evt.email,
    paddle_txn: evt.txnId,
  });
  await enqueueJob(evt.orderId);
  return NextResponse.json({ ok: true });
}
