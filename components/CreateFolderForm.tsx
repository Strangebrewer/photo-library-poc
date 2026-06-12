"use client";

import { useState } from "react";
import { createFolder } from "@/app/actions/folders";

export default function CreateFolderForm() {
  const [open, setOpen] = useState(false);

  async function handleSubmit(formData: FormData) {
    await createFolder(formData);
    setOpen(false);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full py-3 rounded-xl border-2 border-dashed border-gray-300 text-gray-500 text-sm font-medium cursor-pointer"
      >
        + New Folder
      </button>
    );
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-3">
      <input
        name="name"
        type="text"
        placeholder="Folder name"
        autoFocus
        className="w-full px-4 py-3 rounded-xl border border-gray-300 text-base outline-none focus:border-blue-500"
      />

      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 py-3 rounded-xl bg-blue-600 text-white text-sm font-medium cursor-pointer"
        >
          Create
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 text-sm font-medium cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
