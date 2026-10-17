import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { DashboardShell } from "@/components/DashboardShell";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ScholarHub — Scholarship Monitoring Dashboard",
  description:
    "Track and monitor master's and graduate scholarships for Indonesian students. LPDP, Chevening, AAS, DAAD, and more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans bg-[#111217] text-[#ccccdc] antialiased`}>
        <DashboardShell>{children}</DashboardShell>
      </body>
    </html>
  );
}
