export default function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div style={{ padding: "24px 28px 20px", borderBottom: "1px solid var(--border-default)", backgroundColor: "#fff" }}>
      <h1 style={{ fontSize: "22px", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: description ? "4px" : 0 }}>
        {title}
      </h1>
      {description && (
        <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0 }}>{description}</p>
      )}
    </div>
  );
}