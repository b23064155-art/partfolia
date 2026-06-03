import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Biloljon Komiljonov — 13 yoshli Frontend Developer",
  description:
    "Biloljon Komiljonov — 13 yoshli Frontend Developer (React, Next.js, TypeScript). Adminly.uz CMS platformasi muallifi. Aloqa: +998 95 020 51 61 | b23064155@gmail.com",
  keywords: [
    "Biloljon Komiljonov",
    "Frontend Developer",
    "React Developer",
    "Next.js Developer",
    "13 yoshli developer",
    "TypeScript",
    "Uzbekistan Developer",
  ],
  authors: [{ name: "Biloljon Komiljonov" }],
  openGraph: {
    title: "Biloljon Komiljonov — 13 yoshli Frontend Developer",
    description:
      "Frontend yo'nalishida professional loyihalar yarataman. React, Next.js va TypeScript bo'yicha mustahkam bilimga egaman. Adminly.uz loyihasi muallifi. Tel: +998 95 020 51 61",
    type: "website",
    siteName: "Biloljon Komiljonov Portfolio",
    locale: "uz_UZ",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
