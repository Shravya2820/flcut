import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { auth } from "@/auth";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FLCut - URL Management Platform",
  description: "Professional URL Management Platform for Finite Loop Club",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const isAuthenticated = !!session?.user;

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      style={{ height: "100%", width: "100%" }}
    >
      <body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: "var(--bg-primary)",
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          height: "100%",
        }}
      >
        {isAuthenticated ? (
          <div style={{ display: "flex", height: "100vh" }}>
            <Sidebar />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", marginLeft: "240px" }}>
              <Navbar session={session} />
              <main
                style={{
                  flex: 1,
                  marginTop: "60px",
                  overflow: "auto",
                  backgroundColor: "var(--bg-primary)",
                }}
              >
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
