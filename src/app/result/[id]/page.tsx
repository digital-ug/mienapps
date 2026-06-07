"use client";
import { use, useEffect, useState } from "react";

export default function Result({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [status, setStatus] = useState("processing");
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const t = setInterval(async () => {
      const r = await fetch(`/api/status/${id}`).then((x) => x.json());
      setStatus(r.status);
      if (r.status === "done") { setResult(r.result); clearInterval(t); }
      if (r.status === "failed") clearInterval(t);
    }, 2500);
    return () => clearInterval(t);
  }, [id]);

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "72px 24px", textAlign: "center" }}>
      {status !== "done" && status !== "failed" && (
        <>
          <h1 className="display" style={{ fontSize: 44, fontWeight: 600 }}>Чертим твою карту…</h1>
          <p style={{ color: "var(--muted)", marginTop: 12 }}>Обычно это занимает меньше минуты.</p>
        </>
      )}
      {status === "failed" && <p>Что-то пошло не так. Мы вернём оплату — напиши в поддержку.</p>}
      {status === "done" && result && (
        <>
          <h1 className="display" style={{ fontSize: 44, fontWeight: 600 }}>{result.title}</h1>
          {result.artifact_url && (
            <img src={result.artifact_url} alt="" style={{ maxWidth: "100%", borderRadius: 14, marginTop: 20 }} />
          )}
          <div style={{ marginTop: 24, display: "flex", gap: 12, justifyContent: "center" }}>
            <a href={result.artifact_url} download
              style={{ padding: "12px 20px", background: "var(--gold)", color: "#1a1730", borderRadius: 10, textDecoration: "none" }}>
              Скачать постер
            </a>
          </div>
        </>
      )}
    </main>
  );
}
