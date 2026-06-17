"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    label: "Admin",
    href: "/dashboard/admin",
    adminOnly: true,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" /><path d="M6 20v-2a6 6 0 0 1 12 0v2" />
      </svg>
    ),
  },
];

interface SidebarProps {
  role?: string | null;
}

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();

  // Filter items out if they are marked adminOnly and user is not an ADMIN
  const visibleNavItems = navItems.filter(item => !item.adminOnly || role === "ADMIN");

  return (
    <aside
      style={{
        width: "220px",
        backgroundColor: "#fff",
        borderRight: "1px solid var(--border-default)",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
      }}
    >
      <div style={{ padding: "20px 16px 16px", borderBottom: "1px solid var(--border-default)" }}>
        <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <div
            style={{
              width: "28px",
              height: "28px",
              backgroundColor: "var(--accent-coral)",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: "15px", color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
            FLCut
          </span>
        </Link>
      </div>

      <nav style={{ flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", gap: "2px" }}>
        {visibleNavItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "9px 10px",
                borderRadius: "6px",
                textDecoration: "none",
                color: isActive ? "var(--accent-coral)" : "var(--text-secondary)",
                backgroundColor: isActive ? "rgba(245, 143, 124, 0.08)" : "transparent",
                fontSize: "14px",
                fontWeight: isActive ? 600 : 400,
                transition: "all 0.15s ease",
              }}
            >
              <span style={{ opacity: isActive ? 1 : 0.6 }}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border-default)" }}>
        <p style={{ fontSize: "11px", color: "#bbb", letterSpacing: "0.02em" }}>Finite Loop Club</p>
      </div>
    </aside>
  );
}