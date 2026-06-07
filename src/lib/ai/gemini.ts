import { GoogleGenerativeAI } from "@google/generative-ai";
import { MODELS } from "./models";
import type { AIArgs, AIResult } from "./types";

const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function callGemini(args: AIArgs): Promise<AIResult> {
  const model = genai.getGenerativeModel({
    model: MODELS.gemini,
    systemInstruction: args.system,
    generationConfig: args.json ? { responseMimeType: "application/json" } : undefined,
  });
  const parts: any[] = [{ text: args.user }];
  for (const img of args.images ?? []) {
    parts.push({ inlineData: { data: img.data, mimeType: img.mime } });
  }
  const res = await model.generateContent(parts);
  const text = res.response.text();
  const usage = res.response.usageMetadata;
  return {
    text,
    provider: "gemini",
    model: MODELS.gemini,
    inputTokens: usage?.promptTokenCount,
    outputTokens: usage?.candidatesTokenCount,
  };
}
