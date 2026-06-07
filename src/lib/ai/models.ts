// ВНИМАНИЕ: строки моделей версионно-зависимы — проверяй актуальные перед релизом.
export const MODELS = {
  claude:  "claude-sonnet-4-5",        // тон/эмпатия/копирайтинг (проверь актуальную строку)
  gemini:  "gemini-2.5-pro",           // Vision / длинный контекст / дёшево
  groqText:"llama-3.3-70b-versatile",  // быстрый дешёвый текст
  groqSTT: "whisper-large-v3-turbo",   // транскрибация
} as const;

// Грубая оценка стоимости для лога (центы за 1k токенов). Подставь свои тарифы.
export const PRICE_PER_1K = {
  claude:  { in: 0.3,  out: 1.5 },
  gemini:  { in: 0.125, out: 0.5 },
  groq:    { in: 0.02, out: 0.02 },
} as const;
