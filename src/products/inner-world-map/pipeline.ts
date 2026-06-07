import { ai, parseJSON } from "@/lib/ai";
import { renderArtifact } from "@/lib/artifact/render";
import { putArtifact } from "@/lib/storage";
import { getOrder, updateOrder } from "@/lib/db";
import { SYSTEM, buildUser, type WorldMap } from "./prompt";
import { InnerWorldMapArtifact } from "./artifact";

export async function run(orderId: string): Promise<Record<string, unknown>> {
  const order = await getOrder(orderId);
  const input = (order.input ?? {}) as Record<string, string>;

  // 1) Структура мира (строгий JSON). reason → Gemini (дёшево), фолбэк Claude.
  const out = await ai("reason", { system: SYSTEM, user: buildUser(input), json: true }, orderId);
  const data = parseJSON<WorldMap>(out.text);

  // 2) Рендер артефакта (детерминированно, Satori). Пак = по стилю на каждый.
  const style = (input.style as string) ?? "fantasy";
  const png = await renderArtifact(InnerWorldMapArtifact({ data, style }));
  const artifact_url = await putArtifact(`${orderId}/map-${style}.png`, png);

  await updateOrder(orderId, { result: { ...data, artifact_url } });
  return { ...data, artifact_url };
}
