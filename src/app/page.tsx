"use client";
import { useEffect, useState } from "react";
import config from "@/products/inner-world-map/config";

declare global { interface Window { Paddle?: any } }

export default function Landing() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (window.Paddle && process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN) {
      if (process.env.NEXT_PUBLIC_PADDLE_ENV !== "production") window.Paddle.Environment.set("sandbox");
      window.Paddle.Setup({ token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN });
    }
  }, []);

  async function start() {
    setBusy(true);
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: answers, lang: navigator.language?.slice(0, 2) || "en" }),
      });
      const { orderId } = await res.json();
      window.Paddle.Checkout.open({
        items: [{ priceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_ID, quantity: 1 }],
        customData: { order_id: orderId },
        settings: { successUrl: `${location.origin}/result/${orderId}` },
      });
    } finally { setBusy(false); }
  }

  const ready = config.inputs.every((i) => (answers[i.id] ?? "").trim().length > 1);

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "72px 24px 120px" }}>
      <p style={{ letterSpacing: 4, color: "var(--gold)", fontSize: 13 }}>АТЛАС ВНУТРЕННЕГО МИРА</p>
      <h1 className="display" style={{ fontSize: 64, lineHeight: 1.02, fontWeight: 700, marginTop: 10 }}>
        Что скрывает<br />карта твоей души?
      </h1>
      <p style={{ color: "var(--muted)", fontSize: 20, marginTop: 18, maxWidth: 540 }}>
        Ответь на 5 вопросов — и AI начертит личный фэнтези-атлас твоей психики.
        Море Тревоги, Горы Амбиций, Маяк Самореализации. Готовый постер за минуту.
      </p>

      <div style={{ marginTop: 44, display: "flex", flexDirection: "column", gap: 22 }}>
        {config.inputs.map((inp, idx) => (
          <label key={inp.id} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span style={{ color: "var(--gold)", fontSize: 14 }}>{String(idx + 1).padStart(2, "0")} — {inp.q}</span>
            <input
              value={answers[inp.id] ?? ""}
              onChange={(e) => setAnswers((a) => ({ ...a, [inp.id]: e.target.value }))}
              style={{ background: "transparent", border: "none", borderBottom: "1px solid var(--line)",
                color: "var(--ink)", fontSize: 19, padding: "10px 2px", fontFamily: "inherit", outline: "none" }}
            />
          </label>
        ))}
      </div>

      <button
        onClick={start}
        disabled={!ready || busy}
        style={{ marginTop: 40, padding: "16px 28px", fontSize: 18, fontFamily: "inherit",
          background: ready ? "var(--gold)" : "rgba(201,162,75,.25)", color: "#1a1730",
          border: "none", borderRadius: 10, cursor: ready ? "pointer" : "default" }}
      >
        {busy ? "Готовим..." : `Начертить мою карту · €${config.price_eur}`}
      </button>
      <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 14 }}>
        Стоит как чашка кофе. Развлекательный характер.
      </p>
    </main>
  );
}
