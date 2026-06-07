import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { deletePrefix } from "@/lib/storage";

export const runtime = "nodejs";

// Дёргается cron-job.org. Чистит загрузки заказов с истёкшим TTL.
export async function GET(req: NextRequest) {
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { data } = await db
    .from("orders").select("id").lt("expires_at", new Date().toISOString());
  for (const o of data ?? []) await deletePrefix(o.id).catch(() => {});
  return NextResponse.json({ cleaned: data?.length ?? 0 });
}
