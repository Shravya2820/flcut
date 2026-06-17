import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", backgroundColor: "var(--bg-primary)" }}>
      <div style={{ width: "100%", maxWidth: "400px", textAlign: "center" }}>
        <div className="card card-lg">
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "10px",
              border: "1px solid var(--border-default)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              backgroundColor: "var(--bg-primary)",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>

          <h1 style={{ fontSize: "22px", marginBottom: "10px" }}>Access Restricted</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6, marginBottom: "24px" }}>
            You are not part of the authorized FLC core committee. Contact an administrator if you believe this is a mistake.
          </p>

          <Link
            href="/"
            style={{
              display: "inline-block",
              padding: "9px 20px",
              backgroundColor: "var(--text-primary)",
              color: "#fff",
              borderRadius: "7px",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            Return home
          </Link>
        </div>
      </div>
    </main>
  );
}