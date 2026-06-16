"use client";

import { useState } from "react";
import DeletePhotoButton from "@/components/DeletePhotoButton";
import PhotoViewerModal from "@/components/PhotoViewerModal";

type Photo = { id: string; thumbUrl: string; fullUrl: string };

export default function PhotoGrid({ photos }: { photos: Photo[] }) {
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);

  return (
    <>
      <div className="grid grid-cols-3 gap-1">
        {photos.map((photo) => (
          <div key={photo.id} className="relative">
            <button
              onClick={() => setSelectedUrl(photo.fullUrl)}
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
          </div>
        ))}
      </div>

      <PhotoViewerModal
        url={selectedUrl}
        onClose={() => setSelectedUrl(null)}
      />
    </>
  );
}
