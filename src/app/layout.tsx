import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ShellProvider } from "@/components/ShellProvider";
import { AuthProvider } from "@/components/AuthProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Ecosphere - Modern ESG & Gamification Platform",
  description: "Manage environmental, social, and governance metrics with team gamification.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn("min-h-screen font-sans antialiased", inter.variable)}>
        <AuthProvider>
          <ShellProvider>{children}</ShellProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
