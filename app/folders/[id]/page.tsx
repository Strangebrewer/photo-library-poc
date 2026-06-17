import Link from "next/link";
import { notFound } from "next/navigation";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { prisma } from "@/lib/prisma";
import { s3, S3_BUCKET } from "@/lib/s3";
import AddPhotoButton from "@/components/AddPhotoButton";
import CreateFolderForm from "@/components/CreateFolderForm";
import Breadcrumb from "@/components/Breadcrumb";
import DeleteFolderButton from "@/components/DeleteFolderButton";
import PhotoGrid from "@/components/PhotoGrid";
import { auth } from "@/auth";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function FolderPage({ params }: Props) {
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
      include: { _count: { select: { children: true, photos: true } } },
    }),
    prisma.photo.findMany({
      where: { folderId: id, userId: session!.user.id },
      include: { tags: { include: { tag: { select: { name: true } } } } },
    }),
  ]);

  const [thumbUrls, fullUrls] = await Promise.all([
    Promise.all(
      photos.map((photo) =>
        getSignedUrl(
          s3,
          new GetObjectCommand({
            Bucket: S3_BUCKET,
            Key: `${photo.key}_thumb.jpg`,
          }),
          { expiresIn: 3600 },
        ),
      ),
    ),
    Promise.all(
      photos.map((photo) =>
        getSignedUrl(
          s3,
          new GetObjectCommand({ Bucket: S3_BUCKET, Key: `${photo.key}.jpg` }),
          { expiresIn: 3600 },
        ),
      ),
    ),
  ]);

  return (
    <main className="max-w-lg mx-auto px-4 py-8">
      <div className="mb-6">
        <Breadcrumb ancestors={ancestors} current={folder.name} />
      </div>

      <div className="mb-6">
        <CreateFolderForm parentId={id} />
      </div>

      {subfolders.length ? (
        <ul className="divide-y divide-gray-100 mb-6">
          {subfolders.map((sub) => (
            <li key={sub.id} className="flex items-center">
              <DeleteFolderButton
                folderId={sub.id}
                folderName={sub.name}
                canDelete={sub._count.children === 0 && sub._count.photos === 0}
              />
              <Link
                href={`/folders/${sub.id}`}
                className="flex-1 flex items-center justify-between py-2.5 text-base font-medium"
              >
                <span>{sub.name}</span>
                <span className="text-gray-400">&gt;</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}

      {!photos.length && !subfolders.length ? (
        <p className="text-gray-400 text-center py-12 text-sm">No photos yet</p>
      ) : photos.length ? (
        <PhotoGrid
          photos={photos.map((photo, i) => ({
            id: photo.id,
            thumbUrl: thumbUrls[i],
            fullUrl: fullUrls[i],
            name: photo.name,
            takenAt: photo.takenAt.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
            description: photo.description ?? "",
            tags: photo.tags.map((pt) => pt.tag.name),
          }))}
        />
      ) : null}

      <div className="fixed bottom-6 right-6">
        <AddPhotoButton folderId={folder.id} />
      </div>
    </main>
  );
}
