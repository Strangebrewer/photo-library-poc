"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function savePhoto(params: {
  uuid: string;
  name: string;
  description: string;
  tags: string[];
  folderId: string;
}): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  const userId = session.user.id;

  const tagRecords = await Promise.all(
    params.tags.map((name) =>
      prisma.tag.upsert({
        where: { userId_name: { userId, name } },
        update: {},
        create: { name, userId },
        select: { id: true },
      }),
    ),
  );

  await prisma.photo.create({
    data: {
      key: params.uuid,
      name: params.name,
      description: params.description || null,
      folderId: params.folderId,
      userId,
      tags: {
        create: tagRecords.map((tag) => ({ tagId: tag.id })),
      },
    },
  });

  revalidatePath(`/folders/${params.folderId}`);
}
