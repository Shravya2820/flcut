interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 24px",
        textAlign: "center",
      }}
    >
      <span style={{ fontSize: "48px", marginBottom: "16px" }}>{icon}</span>
      <h3 style={{ marginBottom: "8px", color: "var(--text-primary)" }}>{title}</h3>
      <p style={{ color: "var(--text-secondary)", marginBottom: action ? "24px" : "0" }}>
        {description}
      </p>
      {action && (
        <button className="btn-primary btn-sm" onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  );
}
