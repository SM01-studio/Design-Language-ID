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
      <head>
        {/* Instant loading screen — renders before React hydrates */}
        <style dangerouslySetInnerHTML={{ __html: `
          #app-loader {
            position: fixed; inset: 0; z-index: 9999;
            display: flex; flex-direction: column;
            align-items: center; justify-content: center;
            background: #1E1C1A;
            font-family: system-ui, -apple-system, sans-serif;
          }
          #app-loader .ring {
            width: 44px; height: 44px;
            border: 2.5px solid rgba(255,255,255,0.1);
            border-top-color: #D97706;
            border-radius: 50%;
            animation: _spin 0.8s linear infinite;
          }
          #app-loader .label {
            margin-top: 14px;
            font-size: 13px;
            color: rgba(255,255,255,0.5);
          }
          @keyframes _spin { to { transform: rotate(360deg); } }
        ` }} />
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            var d=document,s=d.getElementById('app-loader');
            function rm(){if(s&&s.parentNode)s.parentNode.removeChild(s)}
            if(d.readyState==='complete')rm();
            else window.addEventListener('load',rm);
            setTimeout(rm,15000);
          })();
        ` }} />
      </head>
      <body className="min-h-full bg-[var(--bg-primary)] text-[var(--text-primary)] font-body">
        <div id="app-loader">
          <div className="ring" />
          <p className="label">正在验证身份...</p>
        </div>
        {children}
      </body>
    </html>
  );
}
