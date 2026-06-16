"use client";

import Modal from "@/components/Modal";

type Props = {
  url: string | null;
  onClose: () => void;
};

export default function PhotoViewerModal({ url, onClose }: Props) {
  return (
    <Modal isOpen={url !== null} close={onClose}>
      {url && (
        <img
          src={url}
          alt=""
          className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
        />
      )}
    </Modal>
  );
}
