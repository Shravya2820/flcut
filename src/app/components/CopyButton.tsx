"use client";

import React, { useState } from "react";

interface CopyButtonProps {
  text: string;
  label?: string;
  compact?: boolean;
}

export default function CopyButton({ text, label = "Copy", compact = false }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const className = compact ? "btn-secondary btn-sm" : "btn-secondary btn-sm";

  return (
    <button type="button" onClick={handleCopy} className={className}>
      {copied ? "✓ Copied!" : `📋 ${label}`}
    </button>
  );
}
