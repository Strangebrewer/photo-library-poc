"use client";

import { useState } from "react";
import DeletePhotoButton from "@/components/DeletePhotoButton";
import PhotoViewerModal from "@/components/PhotoViewerModal";

export type Photo = {
  id: string;
  thumbUrl: string;
  fullUrl: string;
  name: string;
  takenAt: string;
  description: string;
  tags: string[];
};

export default function PhotoGrid({ photos }: { photos: Photo[] }) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  return (
    <>
      <div className="grid grid-cols-3 gap-1">
        {photos.map((photo) => (
          <div key={photo.id} className="relative flex flex-col">
            <button
              onClick={() => setSelectedPhoto(photo)}
              className="w-full cursor-pointer"
              aria-label="View photo"
            >
              <img
                src={photo.thumbUrl}
                alt=""
                className="w-full aspect-square object-cover"
              />
            </button>
            <DeletePhotoButton photoId={photo.id} />
            <div className="px-0.5 pt-1 pb-2">
              <p className="text-xs font-medium text-gray-900 line-clamp-2 leading-tight">{photo.name}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">{photo.takenAt}</p>
            </div>
          </div>
        ))}
      </div>

      <PhotoViewerModal
        photo={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
      />
    </>
  );
}
