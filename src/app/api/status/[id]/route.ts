import { NextRequest, NextResponse } from "next/server";
import { getOrder } from "@/lib/db";

export const runtime = "nodejs";

// Поллинг статуса с /result/[id].
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrder(id);
  return NextResponse.json({ status: order.status, result: order.result ?? null });
}
