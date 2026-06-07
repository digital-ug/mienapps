import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Карта твоего внутреннего мира",
  description: "AI рисует атлас твоей души. Готовый постер за минуту.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Spectral:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
        <script src="https://cdn.paddle.com/paddle/v2/paddle.js" async />
      </head>
      <body>{children}</body>
    </html>
  );
}
