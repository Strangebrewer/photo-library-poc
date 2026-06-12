'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createFolder(formData: FormData) {
  const name = (formData.get('name') as string)?.trim()
  if (!name) return
  await prisma.folder.create({ data: { name } })
  revalidatePath('/')
}

export async function addPhotoKey(folderId: string, uuid: string) {
  await prisma.folder.update({
    where: { id: folderId },
    data: { photoKeys: { push: uuid } },
  })
  revalidatePath(`/folders/${folderId}`)
}
