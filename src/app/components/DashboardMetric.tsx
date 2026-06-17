interface DashboardMetricProps {
  label: string;
  value: string | number;
  icon?: string;
}
export default function DashboardMetric({ label, value }: DashboardMetricProps) {
  return (
    <div
      className="card"
      style={{ padding: "20px 24px" }}
    >
      <p style={{ fontSize: "12px", fontWeight: 500, color: "var(--text-secondary)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {label}
      </p>
      <p style={{ fontSize: "28px", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
        {value}
      </p>
    </div>
  );
}