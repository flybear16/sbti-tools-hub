import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SBTI 测评工具导航 | 一站找到所有版本",
  description: "收录全网SBTI测评工具，包括官方版、快速版、隐藏人格版等，提供分类筛选、用户评分和直达测试入口。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col h-full">
        {children}
      </body>
    </html>
  );
}
