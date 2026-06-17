"use client";

import { useRef, useState } from "react";
import { resizeBoth } from "@/lib/resize-image";
import { savePhoto } from "@/app/actions/photos";
import PhotoMetadataModal, { type PhotoMetadata } from "@/components/PhotoMetadataModal";

type FABState = "idle" | "resizing" | "pending" | "uploading" | "done";
type PendingBlobs = { full: Blob; thumb: Blob };

export default function AddPhotoButton({ folderId, disabled: disabledProp = false }: { folderId?: string; disabled?: boolean }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fabState, setFabState] = useState<FABState>("idle");
  const [pendingBlobs, setPendingBlobs] = useState<PendingBlobs | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setFabState("resizing");
    const blobs = await resizeBoth(file);
    inputRef.current!.value = "";
    setPendingBlobs(blobs);
    setFabState("pending");
  }

  function handleModalClose() {
    setPendingBlobs(null);
    setFabState("idle");
  }

  async function handleSubmit(metadata: PhotoMetadata) {
    const blobs = pendingBlobs!;
    setPendingBlobs(null);
    setFabState("uploading");

    const res = await fetch("/api/upload-url", { method: "POST" });
    const { uuid, fullUrl, thumbUrl } = await res.json();

    await Promise.all([
      fetch(fullUrl, { method: "PUT", body: blobs.full, headers: { "Content-Type": "image/jpeg" } }),
      fetch(thumbUrl, { method: "PUT", body: blobs.thumb, headers: { "Content-Type": "image/jpeg" } }),
    ]);

    await savePhoto({ uuid, ...metadata });

    setFabState("done");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setFabState("idle");
  }

  const bgColor = {
    idle: "bg-blue-600",
    resizing: "bg-purple-600",
    pending: "bg-blue-600",
    uploading: "bg-purple-600",
    done: "bg-green-500",
  }[fabState];

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
        disabled={disabledProp || fabState !== "idle"}
        className={`h-14 px-6 rounded-full text-white text-sm font-semibold shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed ${bgColor}`}
      >
        {(fabState === "resizing" || fabState === "uploading") && (
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {fabState === "done" && (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
        {(fabState === "idle" || fabState === "pending") && "Add Photo"}
      </button>

      {pendingBlobs && (
        <PhotoMetadataModal
          defaultFolderId={folderId}
          onSubmit={handleSubmit}
          onClose={handleModalClose}
        />
      )}
    </>
  );
}
