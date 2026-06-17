"use client";

import { useState } from "react";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import { deleteFolder } from "@/app/actions/folders";

type Props = {
  folderId: string;
  folderName: string;
  canDelete: boolean;
};

export default function DeleteFolderButton({ folderId, folderName, canDelete }: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setConfirmOpen(true)}
        disabled={!canDelete}
        aria-label={`Delete ${folderName}`}
        className="p-2 text-red-500 disabled:text-gray-300 disabled:cursor-not-allowed cursor-pointer shrink-0"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {confirmOpen && (
        <DeleteConfirmationModal
          message={<>Are you sure you want to delete <span className="font-semibold">{folderName}</span>?</>}
          onConfirm={async () => { await deleteFolder(folderId); }}
          onClose={() => setConfirmOpen(false)}
        />
      )}
    </>
  );
}
