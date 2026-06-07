// Реестр продуктов. Добавляешь продукт → импортируешь сюда.
import innerWorldMap from "./inner-world-map/config";
import { run as runInnerWorldMap } from "./inner-world-map/pipeline";

export type ProductConfig = {
  slug: string;
  price_eur: number;
  title: string;
  inputs: { id: string; q: string; type?: string }[];
  artifact_styles?: string[];
};

type Product = { config: ProductConfig; run: (orderId: string) => Promise<Record<string, unknown>> };

export const PRODUCTS: Record<string, Product> = {
  "inner-world-map": { config: innerWorldMap, run: runInnerWorldMap },
  // "ai-courtroom": { config: aiCourtroom, run: runAiCourtroom },
};

export function getProduct(slug: string): Product {
  const p = PRODUCTS[slug];
  if (!p) throw new Error(`Unknown product: ${slug}`);
  return p;
}

// Какой продукт обслуживает текущий деплой (одно репо = один продукт).
export const ACTIVE = process.env.NEXT_PUBLIC_PRODUCT ?? "inner-world-map";
