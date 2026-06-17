"use client";

import Modal from "@/components/Modal";
import type { Photo } from "@/components/PhotoGrid";

type Props = {
  photo: Photo | null;
  onClose: () => void;
};

export default function PhotoViewerModal({ photo, onClose }: Props) {
  if (!photo) return null;

  return (
    <Modal close={onClose}>
      <div className="flex flex-col items-center">
        <img
          src={photo.fullUrl}
          alt=""
          className="max-w-[90vw] max-h-[70vh] object-contain rounded-lg"
        />

        <div className="max-w-[90vw] mt-3 px-1">
          <p className="text-white font-semibold text-sm">{photo.name}</p>
          <p className="text-gray-400 text-xs mt-0.5">{photo.takenAt}</p>

          {photo.description && (
            <p className="text-gray-300 text-sm mt-2">{photo.description}</p>
          )}

          {photo.tags.length > 0 && (
            <div className="mt-2">
              <span className="text-gray-400 text-xs mr-1.5">Tags:</span>
              <div className="inline-flex flex-wrap gap-1.5">
                {photo.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-blue-100 text-blue-800 text-[10px] px-2 py-0.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
