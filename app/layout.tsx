import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Biloljon Komiljonov",
  description: "Biloljon Komiljonov — 13 yoshli Frontend Developer...",
  keywords: ["Frontend Developer", "React Developer", "Next.js Developer"],
  openGraph: {
    title: "Biloljon Komiljonov",
    description: "Frontend yo'nalishida professional loyihalar yarataman...",
    url: "https://portfolia.vercel.app/",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <body>{children}</body>
    </html>
  );
}