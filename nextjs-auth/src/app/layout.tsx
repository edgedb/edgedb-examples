import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Todo Example App",
  description:
    "A simple todo example app to demonstrate using Next.js (App router) with EdgeDB Auth",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} flex flex-col items-center bg-slate-100 text-slate-800 h-screen bg-fixed`}
        style={{
          backgroundImage:
            "radial-gradient(at 16% 57%, rgba(224, 242, 254, 0.6) 0, transparent 48%), radial-gradient(at 76% 100%, rgba(207, 250, 254, 0.4) 0, transparent 32%), radial-gradient(at 77% 21%, rgba(224, 231, 255, 0.3) 0, transparent 68%)",
        }}
      >
        {children}
      </body>
    </html>
  );
}
