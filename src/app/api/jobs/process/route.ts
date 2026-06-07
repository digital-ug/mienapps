import { NextRequest, NextResponse } from "next/server";
import { verifyQStash } from "@/lib/queue";
import { getOrder, updateOrder } from "@/lib/db";
import { deletePrefix } from "@/lib/storage";
import { sendResult } from "@/lib/email";
import { getProduct } from "@/products";

export const runtime = "nodejs";
export const maxDuration = 300; // даём генерации время (Vercel Pro)

// Цель QStash. Запускает pipeline продукта, шлёт результат, чистит загрузки.
export async function POST(req: NextRequest) {
  const raw = await req.text();
  const sig = req.headers.get("upstash-signature") ?? "";
  if (!(await verifyQStash(sig, raw))) {
    return NextResponse.json({ error: "bad_signature" }, { status: 401 });
  }

  const { orderId } = JSON.parse(raw);
  try {
    await updateOrder(orderId, { status: "processing" });
    const order = await getOrder(orderId);
    const product = getProduct(order.product);

    const result = await product.run(orderId);
    await updateOrder(orderId, { status: "done" });

    if (order.email) {
      await sendResult(
        order.email,
        product.config.title,
        `${process.env.NEXT_PUBLIC_APP_URL}/result/${orderId}`,
        String((result as any).artifact_url ?? "")
      );
    }
    // GDPR: удалить пользовательские загрузки сразу после генерации
    await deletePrefix(orderId).catch(() => {});
    return NextResponse.json({ ok: true });
  } catch (e) {
    await updateOrder(orderId, { status: "failed" });
    throw e; // QStash сделает ретрай
  }
}
