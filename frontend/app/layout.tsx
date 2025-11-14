import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "视频下载器",
  description: "支持Youtube, Bilibili, TikTok",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
