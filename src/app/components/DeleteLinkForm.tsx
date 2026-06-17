"use client";

import React from "react";
import { deleteLink } from "@/app/actions/link-management";

interface DeleteLinkFormProps {
  linkId: string;
}

export default function DeleteLinkForm({ linkId }: DeleteLinkFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!confirm("Delete this link? This cannot be undone.")) {
      e.preventDefault();
    }
  };

  return (
    <form action={deleteLink.bind(null, linkId)} onSubmit={handleSubmit} style={{ display: "contents" }}>
      <button
        type="submit"
        style={{
          backgroundColor: "transparent",
          border: "1px solid #fecaca",
          borderRadius: "6px",
          padding: "6px 12px",
          fontSize: "13px",
          fontWeight: 500,
          color: "#C62828",
          cursor: "pointer",
          transition: "all 0.15s ease",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(244,67,54,0.06)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
        }}
      >
        Delete
      </button>
    </form>
  );
}