'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createFolder(formData: FormData) {
  const name = (formData.get('name') as string)?.trim()
  if (!name) return
  await prisma.folder.create({ data: { name } })
  revalidatePath('/')
}
