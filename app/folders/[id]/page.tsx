import Link from "next/link";
import { notFound } from "next/navigation";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { prisma } from "@/lib/prisma";
import { s3, S3_BUCKET } from "@/lib/s3";
import AddPhotoButton from "@/components/AddPhotoButton";
import DeletePhotoButton from "@/components/DeletePhotoButton";

export default async function FolderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const folder = await prisma.folder.findUnique({ where: { id } });

  if (!folder) notFound();

  const thumbUrls = await Promise.all(
    folder.photoKeys.map((key) =>
      getSignedUrl(
        s3,
        new GetObjectCommand({ Bucket: S3_BUCKET, Key: `${key}_thumb.jpg` }),
        { expiresIn: 3600 },
      ),
    ),
  );

  return (
    <main className="max-w-lg mx-auto px-4 py-8">
      <header className="flex items-center gap-4 mb-6">
        <Link href="/" className="text-gray-500 text-sm">
          ← Back
        </Link>
        <h1 className="text-xl font-semibold">{folder.name}</h1>
      </header>

      {folder.photoKeys.length === 0 ? (
        <p className="text-gray-400 text-center py-12 text-sm">No photos yet</p>
      ) : (
        <div className="grid grid-cols-3 gap-1">
          {thumbUrls.map((url, i) => (
            <div key={folder.photoKeys[i]} className="relative">
              <img
                src={url}
                alt=""
                className="w-full aspect-square object-cover"
              />
              <DeletePhotoButton
                folderId={folder.id}
                photoKey={folder.photoKeys[i]}
              />
            </div>
          ))}
        </div>
      )}

      <div className="fixed bottom-6 right-6">
        <AddPhotoButton folderId={folder.id} />
      </div>
    </main>
  );
}
