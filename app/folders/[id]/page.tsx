import Link from "next/link";
import { notFound } from "next/navigation";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { prisma } from "@/lib/prisma";
import { s3, S3_BUCKET } from "@/lib/s3";
import AddPhotoButton from "@/components/AddPhotoButton";
import DeletePhotoButton from "@/components/DeletePhotoButton";
import CreateFolderForm from "@/components/CreateFolderForm";
import Breadcrumb from "@/components/Breadcrumb";
import { auth } from "@/auth";

export default async function FolderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const folder = await prisma.folder.findUnique({
    where: { id, userId: session!.user.id },
  });

  if (!folder) notFound();

  const ancestors: { id: string; name: string }[] = [];
  let cursor = folder.parentId;
  while (cursor) {
    const parent = await prisma.folder.findUnique({
      where: { id: cursor },
      select: { id: true, name: true, parentId: true },
    });
    if (!parent) break;
    ancestors.unshift({ id: parent.id, name: parent.name });
    cursor = parent.parentId;
  }

  const [subfolders, photos] = await Promise.all([
    prisma.folder.findMany({
      where: { parentId: id, userId: session!.user.id },
      orderBy: { name: "asc" },
    }),
    prisma.photo.findMany({
      where: { folderId: id, userId: session!.user.id },
    }),
  ]);

  const thumbUrls = await Promise.all(
    photos.map((photo) =>
      getSignedUrl(
        s3,
        new GetObjectCommand({ Bucket: S3_BUCKET, Key: `${photo.key}_thumb.jpg` }),
        { expiresIn: 3600 },
      ),
    ),
  );

  return (
    <main className="max-w-lg mx-auto px-4 py-8">
      <div className="mb-6">
        <Breadcrumb ancestors={ancestors} current={folder.name} />
      </div>

      <div className="mb-6">
        <CreateFolderForm parentId={id} />
      </div>

      {subfolders.length > 0 && (
        <ul className="divide-y divide-gray-100 mb-6">
          {subfolders.map((sub) => (
            <li key={sub.id}>
              <Link
                href={`/folders/${sub.id}`}
                className="flex items-center justify-between py-4 text-base font-medium"
              >
                <span>{sub.name}</span>
                <span className="text-gray-400">&gt;</span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {photos.length === 0 && subfolders.length === 0 ? (
        <p className="text-gray-400 text-center py-12 text-sm">
          No photos yet
        </p>
      ) : photos.length > 0 ? (
        <div className="grid grid-cols-3 gap-1">
          {photos.map((photo, i) => (
            <div key={photo.id} className="relative">
              <img
                src={thumbUrls[i]}
                alt=""
                className="w-full aspect-square object-cover"
              />
              <DeletePhotoButton photoId={photo.id} />
            </div>
          ))}
        </div>
      ) : null}

      <div className="fixed bottom-6 right-6">
        <AddPhotoButton folderId={folder.id} />
      </div>
    </main>
  );
}
