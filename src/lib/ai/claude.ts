import Anthropic from "@anthropic-ai/sdk";
import { MODELS } from "./models";
import type { AIArgs, AIResult } from "./types";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

export async function callClaude(args: AIArgs): Promise<AIResult> {
  const msg = await client.messages.create({
    model: MODELS.claude,
    max_tokens: args.maxTokens ?? 1500,
    system: args.system,
    messages: [{ role: "user", content: args.user }],
  });
  const text = msg.content.map((b) => (b.type === "text" ? b.text : "")).join("");
  return {
    text,
    provider: "claude",
    model: MODELS.claude,
    inputTokens: msg.usage?.input_tokens,
    outputTokens: msg.usage?.output_tokens,
  };
}
