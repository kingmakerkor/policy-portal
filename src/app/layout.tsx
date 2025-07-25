import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

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
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1542451375735648"
          crossOrigin="anonymous"></script>
      </head>
      <body>
        <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
          <header className="bg-white shadow-sm py-4">
            <nav className="container mx-auto px-4 flex justify-between items-center">
              <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
                정부 정책 및 지원금 정보
              </Link>
            </nav>
          </header>
          <main className="flex-grow">
            {children}
          </main>
          <footer className="bg-gray-800 text-gray-300 py-6 text-center text-sm">
            <div className="container mx-auto px-4">
              &copy; {new Date().getFullYear()} 정부 정책 및 지원금 정보. All rights reserved.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
