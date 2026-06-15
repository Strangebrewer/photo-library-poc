"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3, S3_BUCKET } from "@/lib/s3";
import { auth } from "@/auth";

export async function createFolder(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  const name = (formData.get("name") as string)?.trim();
  if (!name) return;
  await prisma.folder.create({ data: { name, userId: session.user.id } });
  revalidatePath("/");
}

export async function addPhotoKey(folderId: string, uuid: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  await prisma.folder.update({
    where: { id: folderId, userId: session.user.id },
    data: { photoKeys: { push: uuid } },
  });
  revalidatePath(`/folders/${folderId}`);
}

export async function deletePhoto(folderId: string, photoKey: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  const folder = await prisma.folder.findUniqueOrThrow({
    where: { id: folderId, userId: session.user.id },
  });
  await prisma.folder.update({
    where: { id: folderId },
    data: { photoKeys: folder.photoKeys.filter((k) => k !== photoKey) },
  });
  await Promise.all([
    s3.send(
      new DeleteObjectCommand({ Bucket: S3_BUCKET, Key: `${photoKey}.jpg` }),
    ),
    s3.send(
      new DeleteObjectCommand({
        Bucket: S3_BUCKET,
        Key: `${photoKey}_thumb.jpg`,
      }),
    ),
  ]);
  revalidatePath(`/folders/${folderId}`);
}
