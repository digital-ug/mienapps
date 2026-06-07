import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendResult(to: string, title: string, resultUrl: string, artifactUrl: string) {
  await resend.emails.send({
    from: process.env.RESEND_FROM!,
    to,
    subject: `${title} — готово ✨`,
    html: `
      <div style="font-family:Georgia,serif;max-width:520px;margin:auto">
        <h2 style="font-weight:600">Твой результат готов</h2>
        <p>Мы всё сделали. Открой и сохрани:</p>
        <p><a href="${resultUrl}" style="display:inline-block;padding:12px 20px;background:#1a1730;color:#fff;text-decoration:none;border-radius:8px">Открыть результат</a></p>
        <img src="${artifactUrl}" alt="" style="max-width:100%;border-radius:12px;margin-top:16px"/>
        <p style="color:#888;font-size:12px;margin-top:24px">Развлекательный характер. Это не медицинская, психологическая или юридическая рекомендация.</p>
      </div>`,
  });
}
