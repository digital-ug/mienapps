import type { WorldMap } from "./prompt";

const STYLES: Record<string, { bg: string; ink: string; accent: string }> = {
  fantasy:   { bg: "#1c1733", ink: "#efe7d2", accent: "#c9a24b" },
  cyberpunk: { bg: "#0a0e1a", ink: "#d7f5ff", accent: "#ff3bd4" },
  watercolor:{ bg: "#f3ede1", ink: "#3a352c", accent: "#7a8c5a" },
};

// Фиксированные позиции слотов r1..r6 на канве 1080×1350 → стиль всегда «красивый».
const SLOTS: Record<string, { x: number; y: number }> = {
  r1: { x: 120, y: 260 }, r2: { x: 640, y: 360 }, r3: { x: 220, y: 620 },
  r4: { x: 660, y: 720 }, r5: { x: 150, y: 980 }, r6: { x: 620, y: 1040 },
};

export function InnerWorldMapArtifact({ data, style }: { data: WorldMap; style: string }) {
  const s = STYLES[style] ?? STYLES.fantasy;
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column",
      background: s.bg, color: s.ink, fontFamily: "Georgia, serif", padding: 56, position: "relative" }}>
      <div style={{ position: "absolute", inset: 24, border: `2px solid ${s.accent}`, borderRadius: 18, opacity: 0.5 }} />
      <div style={{ fontSize: 40, letterSpacing: 1, color: s.accent }}>АТЛАС ВНУТРЕННЕГО МИРА</div>
      <div style={{ fontSize: 64, fontWeight: 600, marginTop: 8 }}>{data.title}</div>

      <div style={{ position: "relative", flex: 1, marginTop: 24 }}>
        {data.regions.map((r) => {
          const p = SLOTS[r.slot] ?? { x: 200, y: 400 };
          return (
            <div key={r.slot} style={{ position: "absolute", left: p.x - 56, top: p.y - 200,
              display: "flex", flexDirection: "column", width: 340 }}>
              <div style={{ fontSize: 34, fontWeight: 600, color: s.accent }}>{r.name}</div>
              <div style={{ fontSize: 22, opacity: 0.85, marginTop: 4 }}>{r.blurb}</div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", flexDirection: "column", borderTop: `1px solid ${s.accent}`, paddingTop: 20 }}>
        <div style={{ fontSize: 28, fontStyle: "italic" }}>“{data.insight}”</div>
        <div style={{ fontSize: 14, opacity: 0.5, marginTop: 12 }}>
          Развлекательный характер. Не медицинская/психологическая рекомендация.
        </div>
      </div>
    </div>
  );
}
