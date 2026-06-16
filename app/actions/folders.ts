"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3, S3_BUCKET } from "@/lib/s3";
import { auth } from "@/auth";

export async function getFolders() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return prisma.folder.findMany({
    where: { userId: session.user.id },
    select: { id: true, name: true, parentId: true },
    orderBy: { name: "asc" },
  });
}

export async function createFolder(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  const name = (formData.get("name") as string)?.trim();
  const parentId = (formData.get("parentId") as string) || null;
  if (!name) return;
  await prisma.folder.create({
    data: { name, userId: session.user.id, parentId },
  });
  if (parentId) {
    revalidatePath(`/folders/${parentId}`);
  } else {
    revalidatePath("/");
  }
}

export async function deletePhoto(photoId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  const photo = await prisma.photo.findUniqueOrThrow({
    where: { id: photoId, userId: session.user.id },
  });
  await prisma.photo.delete({ where: { id: photoId } });
  await Promise.all([
    s3.send(
      new DeleteObjectCommand({ Bucket: S3_BUCKET, Key: `${photo.key}.jpg` }),
    ),
    s3.send(
      new DeleteObjectCommand({
        Bucket: S3_BUCKET,
        Key: `${photo.key}_thumb.jpg`,
      }),
    ),
  ]);
  revalidatePath(`/folders/${photo.folderId}`);
}
