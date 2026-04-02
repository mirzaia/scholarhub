import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ScholarHub — Scholarship Monitoring Dashboard",
  description:
    "Track and monitor scholarships for Indonesian students. Browse scholarships, manage applications, and never miss a deadline.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-slate-50">
          <Navbar />
          {children}
        </div>
      </body>
    </html>
  );
}
