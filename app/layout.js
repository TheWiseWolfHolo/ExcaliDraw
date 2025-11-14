import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

// 英文：Tiempos Text
const tiemposText = localFont({
  src: [
    {
      path: "../public/fonts/tiempos/TIEMPOSTEXT-REGULAR-WEBFONT-FVBKCKML.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/tiempos/TIEMPOSTEXT-SEMIBOLD-WEBFONT-CKUQAWUP.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/tiempos/TIEMPOSTEXT-REGULARITALIC-WEBFONT-DRLEWHES.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/tiempos/TIEMPOSTEXT-SEMIBOLDITALIC-WEBFONT-CTU2XEIM.woff2",
      weight: "600",
      style: "italic",
    },
  ],
  variable: "--font-tiempos",
  display: "swap",
});

// 中文：苹方
const pingFang = localFont({
  src: [
    {
      path: "../public/fonts/pingfang/PingFangSC-Thin.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "../public/fonts/pingfang/PingFangSC-Ultralight.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "../public/fonts/pingfang/PingFangSC-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/pingfang/PingFangSC-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/pingfang/PingFangSC-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/pingfang/PingFangSC-Semibold.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-pingfang",
  display: "swap",
});

// 等宽字体依然使用 Geist Mono（代码编辑器等）
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Excalidraw",
  description: "AI 驱动的图表生成",
  icons: {
    icon: "/icon.ico",
    shortcut: "/icon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="zh-CN"
      className={`${tiemposText.variable} ${pingFang.variable} ${geistMono.variable}`}
    >
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
