import { createClient } from "@supabase/supabase-js";

// Service-role клиент — ТОЛЬКО на сервере. Никогда не импортировать в клиентский код.
export const db = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

export type Order = {
  id: string;
  product: string;
  status: "draft" | "paid" | "processing" | "done" | "failed";
  lang: string;
  input: Record<string, unknown> | null;
  result: Record<string, unknown> | null;
  email: string | null;
  cost_cents: number;
  paddle_txn: string | null;
  expires_at: string | null;
};

export async function createDraftOrder(product: string, input: unknown, lang = "en") {
  const expires = new Date(Date.now() + 30 * 60_000).toISOString(); // +30 мин TTL
  const { data, error } = await db
    .from("orders")
    .insert({ product, input, lang, status: "draft", expires_at: expires })
    .select("id")
    .single();
  if (error) throw error;
  return data.id as string;
}

export async function getOrder(id: string) {
  const { data, error } = await db.from("orders").select("*").eq("id", id).single();
  if (error) throw error;
  return data as Order;
}

export async function updateOrder(id: string, patch: Partial<Order>) {
  const { error } = await db.from("orders").update(patch).eq("id", id);
  if (error) throw error;
}
