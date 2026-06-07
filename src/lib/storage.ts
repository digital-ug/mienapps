import { db } from "./db";

const BUCKET = "uploads";

// Загрузка пользовательского файла (фото/скрин). Возвращает путь в бакете.
export async function putUpload(path: string, bytes: Uint8Array, contentType: string) {
  const { error } = await db.storage.from(BUCKET).upload(path, bytes, { contentType, upsert: true });
  if (error) throw error;
  return path;
}

// Готовый артефакт (PNG) — публичная подписанная ссылка на 7 дней.
export async function putArtifact(path: string, png: Uint8Array) {
  const { error } = await db.storage.from(BUCKET).upload(path, png, { contentType: "image/png", upsert: true });
  if (error) throw error;
  const { data, error: e2 } = await db.storage.from(BUCKET).createSignedUrl(path, 60 * 60 * 24 * 7);
  if (e2) throw e2;
  return data.signedUrl;
}

export async function deletePrefix(prefix: string) {
  const { data } = await db.storage.from(BUCKET).list(prefix);
  if (!data?.length) return;
  await db.storage.from(BUCKET).remove(data.map((f) => `${prefix}/${f.name}`));
}
