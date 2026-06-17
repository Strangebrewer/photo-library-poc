"use client";

import { useState } from "react";
import Modal from "@/components/Modal";

type Props = {
  message: React.ReactNode;
  onConfirm: () => Promise<void>;
  onClose: () => void;
};

export default function DeleteConfirmationModal({
  message,
  onConfirm,
  onClose,
}: Props) {
  const [deleting, setDeleting] = useState(false);

  async function handleConfirm() {
    setDeleting(true);
    await onConfirm();
    onClose();
  }

  return (
    <Modal close={onClose}>
      <div className="bg-white rounded-xl w-[80vw] max-w-sm p-6 flex flex-col gap-4">
        <p className="text-sm text-gray-800">{message}</p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="flex-1 border cursor-pointer border-gray-300 text-gray-700 rounded-lg py-2 text-sm font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={deleting}
            className="flex-1 cursor-pointer bg-red-600 text-white rounded-lg py-2 text-sm font-medium disabled:opacity-50"
          >
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
