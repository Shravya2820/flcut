interface StatusBadgeProps {
  status: "ACTIVE" | "SCHEDULED" | "EXPIRED" | "LIMIT_REACHED";
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const statusMap = {
    ACTIVE: { label: "Active", class: "badge-active" },
    SCHEDULED: { label: "Scheduled", class: "badge-scheduled" },
    EXPIRED: { label: "Expired", class: "badge-expired" },
    LIMIT_REACHED: { label: "Limit Reached", class: "badge-limit" },
  };

  const { label, class: badgeClass } = statusMap[status];

  return <span className={`badge ${badgeClass}`}>{label}</span>;
}
