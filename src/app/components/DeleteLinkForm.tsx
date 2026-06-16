"use client";

import React from "react";
import { deleteLink } from "@/app/actions/link-management";

interface DeleteLinkFormProps {
  linkId: string;
}

export default function DeleteLinkForm({ linkId }: DeleteLinkFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!confirm("Are you sure you want to delete this link? This action cannot be undone.")) {
      e.preventDefault();
    }
  };

  return (
    <form action={deleteLink.bind(null, linkId)} onSubmit={handleSubmit}>
      <button
        type="submit"
        className="w-full px-4 py-2 bg-[#964734] hover:bg-[#7a3829] text-white rounded-lg font-medium transition-colors text-sm"
      >
        🗑️ Delete
      </button>
    </form>
  );
}
