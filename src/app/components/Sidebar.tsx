"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: "📊" },
  { label: "Admin", href: "/dashboard/admin", icon: "⚙️" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: "240px",
        backgroundColor: "var(--bg-card)",
        borderRight: "1px solid var(--border-default)",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
      }}
    >
      {/* Logo Area */}
      <div style={{ padding: "20px 16px", borderBottom: "1px solid var(--border-default)" }}>
        <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
          <span style={{ fontSize: "24px" }}>✂️</span>
          <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>FLCut</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "16px", display: "flex", flexDirection: "column", gap: "4px" }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 12px",
                borderRadius: "6px",
                textDecoration: "none",
                color: isActive ? "white" : "var(--text-primary)",
                backgroundColor: isActive ? "var(--accent-coral)" : "transparent",
                transition: "all 0.2s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = "#F5F5F5";
              }}
              onMouseLeave={(e) => {
                if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
              }}
            >
              <span style={{ fontSize: "18px" }}>{item.icon}</span>
              <span style={{ fontSize: "14px", fontWeight: 500 }}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Note */}
      <div style={{ padding: "16px", borderTop: "1px solid var(--border-default)", fontSize: "11px", color: "var(--text-secondary)" }}>
        v1.0 • URL Management
      </div>
    </aside>
  );
}
