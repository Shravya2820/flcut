"use client";

import React from "react";
import { deleteLink } from "@/app/actions/link-management";

interface DeleteLinkFormProps {
  linkId: string;
  compact?: boolean;
}

export default function DeleteLinkForm({ linkId, compact = false }: DeleteLinkFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!confirm("Are you sure you want to delete this link? This action cannot be undone.")) {
      e.preventDefault();
    }
  };

  return (
    <form action={deleteLink.bind(null, linkId)} onSubmit={handleSubmit} style={{ display: "contents" }}>
      <button
        type="submit"
        style={{
          backgroundColor: "var(--accent-coral)",
          color: "white",
          border: "none",
          borderRadius: "6px",
          padding: compact ? "8px 12px" : "10px 16px",
          fontSize: compact ? "13px" : "14px",
          fontWeight: 500,
          cursor: "pointer",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.backgroundColor = "#E67A66";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.backgroundColor = "var(--accent-coral)";
        }}
      >
        🗑️ Delete
      </button>
    </form>
  );
}
