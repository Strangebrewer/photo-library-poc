"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3, S3_BUCKET } from "@/lib/s3";

export async function createFolder(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  if (!name) return;
  await prisma.folder.create({ data: { name } });
  revalidatePath("/");
}

export async function addPhotoKey(folderId: string, uuid: string) {
  await prisma.folder.update({
    where: { id: folderId },
    data: { photoKeys: { push: uuid } },
  });
  revalidatePath(`/folders/${folderId}`);
}

export async function deletePhoto(folderId: string, photoKey: string) {
  const folder = await prisma.folder.findUniqueOrThrow({
    where: { id: folderId },
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
