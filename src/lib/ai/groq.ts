import Groq from "groq-sdk";
import { MODELS } from "./models";
import type { AIArgs, AIResult } from "./types";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

export async function callGroq(args: AIArgs): Promise<AIResult> {
  const res = await groq.chat.completions.create({
    model: MODELS.groqText,
    messages: [
      ...(args.system ? [{ role: "system" as const, content: args.system }] : []),
      { role: "user", content: args.user },
    ],
    response_format: args.json ? { type: "json_object" } : undefined,
  });
  return {
    text: res.choices[0]?.message?.content ?? "",
    provider: "groq",
    model: MODELS.groqText,
    inputTokens: res.usage?.prompt_tokens,
    outputTokens: res.usage?.completion_tokens,
  };
}

// Транскрибация (Whisper на Groq)
export async function transcribe(file: File): Promise<string> {
  const res = await groq.audio.transcriptions.create({ file, model: MODELS.groqSTT } as any);
  return (res as any).text ?? "";
}
