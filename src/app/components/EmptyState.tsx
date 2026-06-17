export default function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div style={{ padding: "64px 24px", textAlign: "center" }}>
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "10px",
          backgroundColor: "var(--bg-primary)",
          border: "1px solid var(--border-default)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 16px",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      </div>
      <h3 style={{ fontSize: "15px", fontWeight: 600, marginBottom: "6px", color: "var(--text-primary)" }}>{title}</h3>
      <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{description}</p>
    </div>
  );
}