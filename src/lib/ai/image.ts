import Replicate from "replicate";

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

// Опц. генерация картинки Flux. Для текстовых артефактов предпочитай Satori (см. artifact/render).
export async function generateImage(prompt: string): Promise<string> {
  const out = (await replicate.run("black-forest-labs/flux-schnell", {
    input: { prompt, aspect_ratio: "3:4", output_format: "png" },
  })) as unknown as string[];
  return out[0];
}
