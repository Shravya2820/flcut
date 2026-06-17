"use client";

import React, { useState } from "react";

interface CopyButtonProps {
  text: string;
  label?: string;
}

export default function CopyButton({ text, label = "Copy" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      style={{
        backgroundColor: copied ? "rgba(76, 175, 80, 0.08)" : "transparent",
        border: "1px solid var(--border-default)",
        borderRadius: "6px",
        padding: "6px 12px",
        fontSize: "13px",
        fontWeight: 500,
        color: copied ? "#2E7D32" : "var(--text-secondary)",
        cursor: "pointer",
        transition: "all 0.15s ease",
        whiteSpace: "nowrap",
      }}
    >
      {copied ? "Copied" : label}
    </button>
  );
}