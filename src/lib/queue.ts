import { Client, Receiver } from "@upstash/qstash";

const qstash = new Client({ token: process.env.QSTASH_TOKEN! });

// Поставить задачу генерации. QStash вызовет наш /api/jobs/process сервер-сервер
// (без таймаута браузера) и сделает ретраи при сбое.
export async function enqueueJob(orderId: string) {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/api/jobs/process`;
  await qstash.publishJSON({ url, body: { orderId }, retries: 3 });
}

const receiver = new Receiver({
  currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY!,
  nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY!,
});

export async function verifyQStash(signature: string, body: string) {
  return receiver.verify({ signature, body });
}
