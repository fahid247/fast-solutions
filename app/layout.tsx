import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Fast Solutions — Premium Agency Command Center",
  description: "Internal operations and client tracking platform for Fast Solutions digital agency. Track sprint progress, active initiatives, revenue, and team performance in real-time.",
  keywords: ["fast solutions", "digital agency", "operations", "project management", "client portal"],
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "Fast Solutions Operations",
    description: "Digital agency command center and client portal",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} font-sans bg-background text-foreground antialiased min-h-screen`} suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
