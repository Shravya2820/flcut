"use client";

import React, { useState } from "react";

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
}

export default function CopyButton({ text, label = "Copy", className = "" }: CopyButtonProps) {
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

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`px-3 py-2 rounded-lg font-medium transition-colors flex items-center gap-1 ${
        copied
          ? "bg-green-500 text-white"
          : "bg-[#0FA4AF] text-white hover:bg-[#024950]"
      } ${className}`}
    >
      {copied ? (
        <>
          <span>✓ Copied!</span>
        </>
      ) : (
        <>
          <span>📋 {label}</span>
        </>
      )}
    </button>
  );
}
