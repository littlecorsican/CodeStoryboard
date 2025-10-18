import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LeftMenu from "../components/LeftMenu";
import { GlobalProvider } from "../contexts/GlobalContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Code Storyboard",
  description: "Code Storyboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GlobalProvider>
          <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            <LeftMenu />
            <main className="flex-1 overflow-auto">
              {children}
            </main>
          </div>
        </GlobalProvider>
      </body>
    </html>
  );
}
