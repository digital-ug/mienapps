export type Task = "transcribe" | "vision" | "reason" | "empathy" | "cheap";

export type AIArgs = {
  system?: string;
  user: string;
  images?: { data: string; mime: string }[]; // base64 для Vision
  json?: boolean;                            // ожидаем строгий JSON
  maxTokens?: number;
};

export type AIResult = {
  text: string;
  provider: string;
  model: string;
  inputTokens?: number;
  outputTokens?: number;
};
