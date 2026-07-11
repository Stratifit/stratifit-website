"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { HiTrash } from "react-icons/hi2";

/* ------------------------------------------------------------------ */
/*  Delete a single notify_subscriber via DELETE /api/notify?id=...   */
/* ------------------------------------------------------------------ */

export function DeleteSubscriberButton({ id, email }: { id: string; email: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  const handleDelete = async () => {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/notify?id=${encodeURIComponent(id)}`, {
          method: "DELETE",
        });
        if (res.ok) {
          router.refresh();
        } else {
          alert("Failed to delete subscriber.");
        }
      } catch {
        alert("Network error while deleting subscriber.");
      } finally {
        setConfirming(false);
      }
    });
  };

  if (confirming) {
    return (
      <div className="inline-flex items-center gap-1">
        <button
          type="button"
          onClick={handleDelete}
          disabled={pending}
          className="px-2.5 py-1.5 rounded-md bg-red-500/20 text-red-300 text-[10px] font-bold hover:bg-red-500/30 transition-colors disabled:opacity-50"
        >
          {pending ? "..." : "Confirm"}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          disabled={pending}
          className="px-2.5 py-1.5 rounded-md bg-white/5 text-gray-400 text-[10px] font-bold hover:bg-white/10 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-gray-500 hover:text-red-400 hover:bg-red-500/10 text-[10px] font-bold transition-colors"
      aria-label={`Delete ${email}`}
      title={`Delete ${email}`}
    >
      <HiTrash className="text-sm" />
      <span>Delete</span>
    </button>
  );
}
