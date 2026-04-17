import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/context";
import Navbar from "@/components/Navbar";
import FamilyCodeGate from "@/components/FamilyCodeGate";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FamilyChores",
  description: "Manage daily chores for your family",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={`${inter.className} min-h-full flex flex-col bg-gray-50`}>
        <StoreProvider>
          <Navbar />
          <main className="flex-1">
            <FamilyCodeGate>{children}</FamilyCodeGate>
          </main>
        </StoreProvider>
      </body>
    </html>
  );
}
