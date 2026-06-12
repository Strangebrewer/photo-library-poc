"use client";

import { useState } from "react";
import { deletePhoto } from "@/app/actions/folders";

export default function DeletePhotoButton({
  folderId,
  photoKey,
}: {
  folderId: string;
  photoKey: string;
}) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    await deletePhoto(folderId, photoKey);
    setDeleting(false);
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="absolute top-1 right-1 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center cursor-pointer"
      aria-label="Delete photo"
    >
      {deleting ? (
        <svg
          className="animate-spin h-3.5 w-3.5"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      ) : (
        <svg
          className="h-3.5 w-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      )}
    </button>
  );
}
