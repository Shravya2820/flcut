import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FLCut — URL Management",
  description: "Internal URL Management Platform for Finite Loop Club",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const isAuthenticated = !!session?.user;

  // Retrieve systemRole safely from database if authenticated
  let systemRole: string | null = null;
  if (session?.user?.email) {
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { systemRole: true }
    });
    systemRole = dbUser?.systemRole || null;
  }

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body style={{ margin: 0, padding: 0, backgroundColor: "var(--bg-primary)", minHeight: "100vh" }}>
        {isAuthenticated ? (
          <div style={{ display: "flex", height: "100vh" }}>
            <Sidebar role={systemRole} />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", marginLeft: "220px" }}>
              <Navbar session={session} />
              <main style={{ flex: 1, marginTop: "56px", overflow: "auto", backgroundColor: "var(--bg-primary)" }}>
                {children}
              </main>
            </div>
          </div>
        ) : (
          <>{children}</>
        )}
      </body>
    </html>
  );
}