import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Komiljonov Biloljon — Full-Stack Developer | React, Next.js, Node.js",
  description:
    "Komiljonov Biloljon — 4+ yillik tajribali Full-Stack Developer. React, Next.js, Node.js, TypeScript, MongoDB, Express.js va AI Engineering bo'yicha mutaxassis. Premium portfolio.",
  keywords: [
    "Komiljonov Biloljon",
    "Full-Stack Developer",
    "React Developer",
    "Next.js Developer",
    "Node.js Developer",
    "TypeScript",
    "MongoDB",
    "Express.js",
    "AI Engineer",
    "Uzbekistan Developer",
  ],
  authors: [{ name: "Akmal Mordayev" }],
  openGraph: {
    title: "Akmal Mordayev — Full-Stack Developer",
    description:
      "4+ yillik tajriba. React, Next.js, Node.js, AI Engineering. Premium portfolio.",
    type: "website",
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
