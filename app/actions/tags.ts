"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function getTags() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return prisma.tag.findMany({
    where: { userId: session.user.id },
    select: { name: true },
    orderBy: { name: "asc" },
  });
}
