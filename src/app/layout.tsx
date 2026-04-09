import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Design Language Translation - ID Showflat — AI设计语言精准转化",
  description: "将模糊的样板房设计需求转化为可落地的设计任务书，6步AI交互式工作流。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full bg-[var(--bg-primary)] text-[var(--text-primary)] font-body">
        {children}
      </body>
    </html>
  );
}
