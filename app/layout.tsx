import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { FloatingMatchmaker } from "@/components/floating-matchmaker";

export const metadata: Metadata = {
  title: "TALISM — AI Matchmaking, Done Properly",
  description:
    "TALISM is an AI matchmaker that gets to know you through conversation, not swiping — then explains exactly why two people might work.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          {children}
          <FloatingMatchmaker />
        </ThemeProvider>
      </body>
    </html>
  );
}
