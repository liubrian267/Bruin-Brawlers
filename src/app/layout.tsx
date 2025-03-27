// app/layout.tsx
"use client";
import { Geist, Geist_Mono } from "next/font/google";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import "./globals.css";
import Navbar from "@/components/Navbar"; // Import the Navbar component
import { useEffect } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    // Check if user has a theme preference in localStorage
    const theme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (theme === "dark" || (!theme && prefersDark)) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-white dark:bg-gray-800/95 transition-colors duration-200`}
      >
        <Provider store={store}>
          <Navbar />
          <main className="min-h-[calc(100vh-4rem)] px-4 dark:text-gray-100">
            {children}
          </main>
        </Provider>
      </body>
    </html>
  );
}
