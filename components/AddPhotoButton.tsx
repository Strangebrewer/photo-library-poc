"use client";

import { useRef, useState } from "react";
import { resizeBoth } from "@/lib/resize-image";
import { addPhotoKey } from "@/app/actions/folders";

export default function AddPhotoButton({ folderId }: { folderId: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const res = await fetch("/api/upload-url", { method: "POST" });
    const { uuid, fullUrl, thumbUrl } = await res.json();

    const { full, thumb } = await resizeBoth(file);

    await Promise.all([
      fetch(fullUrl, {
        method: "PUT",
        body: full,
        headers: { "Content-Type": "image/jpeg" },
      }),
      fetch(thumbUrl, {
        method: "PUT",
        body: thumb,
        headers: { "Content-Type": "image/jpeg" },
      }),
    ]);

    await addPhotoKey(folderId, uuid);

    setUploading(false);
    inputRef.current!.value = "";
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />
      <button
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="w-14 h-14 rounded-full bg-blue-600 text-white text-2xl shadow-lg flex items-center justify-center disabled:opacity-50"
        aria-label="Add photo"
      >
        {uploading ? "…" : "+"}
      </button>
    </>
  );
}
