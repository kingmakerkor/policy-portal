import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Using Inter font for simplicity
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "정부 정책 및 지원금 정보",
  description: "나에게 맞는 정부 정책 및 지원금 정보를 찾아보세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_ADSENSE_PUBLISHER_ID"
          crossOrigin="anonymous"></script>
      </head>
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <header className="bg-blue-600 text-white p-4 shadow-md">
            <nav className="container mx-auto flex justify-between items-center">
              <Link href="/" className="text-2xl font-bold">정부 정책 및 지원금 정보</Link>
            </nav>
          </header>
          <main className="flex-grow">
            {children}
          </main>
          <footer className="bg-gray-800 text-white p-4 text-center mt-auto">
            <div className="container mx-auto">
              &copy; {new Date().getFullYear()} 정부 정책 및 지원금 정보. All rights reserved.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
