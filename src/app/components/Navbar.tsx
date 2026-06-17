"use client";

import React from "react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";

interface NavbarProps {
  session: Session | null;
}

export default function Navbar({ session }: NavbarProps) {
  if (!session?.user) return null;

  const userRole = (session.user as any).role || "MEMBER";
  const userPosition = (session.user as any).position || "";
  const userName = session.user.name || "User";

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        left: "220px",
        height: "56px",
        backgroundColor: "#fff",
        borderBottom: "1px solid var(--border-default)",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        paddingRight: "24px",
        paddingLeft: "24px",
        zIndex: 10,
        gap: "16px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", margin: 0, lineHeight: 1.3 }}>
            {userName}
          </p>
          <p style={{ fontSize: "11px", color: "var(--text-secondary)", margin: 0, lineHeight: 1.3 }}>
            {userPosition ? `${userRole} · ${userPosition.replace(/_/g, " ")}` : userRole}
          </p>
        </div>

        {session.user.image && (
          <img
            src={session.user.image}
            alt={userName}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              border: "1px solid var(--border-default)",
            }}
          />
        )}

        <button
          onClick={() => signOut({ redirectTo: "/" })}
          style={{
            backgroundColor: "transparent",
            border: "1px solid var(--border-default)",
            borderRadius: "6px",
            padding: "6px 12px",
            fontSize: "13px",
            fontWeight: 500,
            color: "var(--text-secondary)",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = "var(--bg-primary)";
            (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
            (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
          }}
        >
          Sign out
        </button>
      </div>
    </header>
  );
}