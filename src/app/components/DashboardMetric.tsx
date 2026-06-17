interface DashboardMetricProps {
  label: string;
  value: string | number;
  icon?: string;
}

export default function DashboardMetric({ label, value, icon }: DashboardMetricProps) {
  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={{ color: "var(--text-secondary)", fontSize: "12px", fontWeight: 500, marginBottom: "8px" }}>
            {label}
          </p>
          <p style={{ fontSize: "32px", fontWeight: 600, color: "var(--text-primary)" }}>
            {value}
          </p>
        </div>
        {icon && <span style={{ fontSize: "32px" }}>{icon}</span>}
      </div>
    </div>
  );
}
