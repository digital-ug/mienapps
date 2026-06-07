import { ImageResponse } from "next/og";
import type { ReactElement } from "react";

/**
 * Рендер «документ-артефактов» (карта, вердикт, постер) детерминированно через Satori.
 * Дешевле и стабильнее по стилю, чем генерация картинкой.
 *
 * Каждый продукт экспортирует React-компонент-шаблон (artifact.tsx), мы превращаем его в PNG.
 * Размер 1080×1350 (вертикаль 4:5 — оптимум для сторис/ленты).
 */
export async function renderArtifact(node: ReactElement): Promise<Uint8Array> {
  const res = new ImageResponse(node, {
    width: 1080,
    height: 1350,
    // fonts: [{ name: "Cormorant", data: <ArrayBuffer>, weight: 600 }],  // подключи свой шрифт
  });
  const buf = await res.arrayBuffer();
  return new Uint8Array(buf);
}
