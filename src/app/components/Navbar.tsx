"use client";

import React from "react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";

interface NavbarProps {
  session: Session | null;
}

export default function Navbar({ session }: NavbarProps) {
  if (!session?.user) {
    return null;
  }

  const userRole = (session.user as any).systemRole || "MEMBER";
  const userName = session.user.name || "User";

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        left: "240px",
        height: "60px",
        backgroundColor: "var(--bg-card)",
        borderBottom: "1px solid var(--border-default)",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        paddingRight: "24px",
        zIndex: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-primary)", margin: "0 0 2px 0" }}>
            {userName}
          </p>
          <span
            style={{
              display: "inline-block",
              fontSize: "11px",
              fontWeight: 600,
              padding: "2px 8px",
              borderRadius: "4px",
              backgroundColor: "rgba(245, 143, 124, 0.1)",
              color: "var(--accent-coral)",
            }}
          >
            {userRole}
          </span>
        </div>

        {session.user.image && (
          <img
            src={session.user.image}
            alt={userName}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "6px",
              border: "1px solid var(--border-default)",
            }}
          />
        )}

        <button
          onClick={async () => {
            await signOut({ redirectTo: "/" });
          }}
          className="btn-secondary btn-sm"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
