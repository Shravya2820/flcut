import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        backgroundColor: "var(--bg-primary)",
      }}
    >
      <div style={{ width: "100%", maxWidth: "400px", textAlign: "center" }}>
        {/* Icon */}
        <span style={{ fontSize: "56px", display: "block", marginBottom: "24px" }}>🔒</span>

        {/* Heading */}
        <h1 style={{ marginBottom: "12px" }}>Access Restricted</h1>

        {/* Description */}
        <p style={{ color: "var(--text-secondary)", marginBottom: "24px", lineHeight: "1.6" }}>
          You are not part of the authorized FLC core committee. Please contact an administrator if you believe this is a mistake.
        </p>

        {/* Button */}
        <Link href="/" className="btn-primary" style={{ display: "inline-block", padding: "10px 24px" }}>
          Return Home
        </Link>
      </div>
    </main>
  );
}