import React from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
}

export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="px-6 py-4 border-b" style={{ borderBottomColor: "var(--border-default)" }}>
      <h1 style={{ fontSize: "28px", fontWeight: 600, marginBottom: description ? "4px" : "0" }}>
        {title}
      </h1>
      {description && (
        <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>{description}</p>
      )}
    </div>
  );
}
