"use client";

import { useRef, useState } from "react";
import { resizeBoth } from "@/lib/resize-image";
import { addPhoto } from "@/app/actions/folders";

type UploadState = "idle" | "uploading" | "done";

export default function AddPhotoButton({ folderId }: { folderId: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<UploadState>("idle");

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setState("uploading");

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

    await addPhoto(folderId, uuid);
    setState("done");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setState("idle");
    inputRef.current!.value = "";
  }

  const bgColor = {
    idle: "bg-blue-600",
    uploading: "bg-purple-600",
    done: "bg-green-500",
  }[state];

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
        disabled={state !== "idle"}
        className={`w-14 h-14 rounded-full text-white text-2xl shadow-lg flex items-center justify-center cursor-pointer ${bgColor}`}
        aria-label="Add photo"
      >
        {state === "uploading" && (
          <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24" fill="none">
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
        )}

        {state === "done" && (
          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}

        {state === "idle" && "+"}
      </button>
    </>
  );
}
