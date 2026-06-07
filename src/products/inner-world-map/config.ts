import type { ProductConfig } from "../index";

const config: ProductConfig = {
  slug: "inner-world-map",
  price_eur: 4.99,
  title: "Карта твоего внутреннего мира",
  inputs: [
    { id: "mood",   q: "Какое чувство в тебе сейчас сильнее всего?" },
    { id: "dream",  q: "О чём ты тайно мечтаешь?" },
    { id: "fear",   q: "Чего ты избегаешь?" },
    { id: "pride",  q: "Чем ты тихо гордишься?" },
    { id: "energy", q: "Куда уходит твоя энергия в последнее время?" },
  ],
  artifact_styles: ["fantasy", "cyberpunk", "watercolor"],
};

export default config;
