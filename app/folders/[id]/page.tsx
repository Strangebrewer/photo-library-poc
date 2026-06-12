import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import AddPhotoButton from '@/components/AddPhotoButton'

export default async function FolderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const folder = await prisma.folder.findUnique({ where: { id } })

  if (!folder) notFound()

  return (
    <main className="max-w-lg mx-auto px-4 py-8">
      <header className="flex items-center gap-4 mb-6">
        <Link href="/" className="text-gray-500 text-sm">← Back</Link>
        <h1 className="text-xl font-semibold">{folder.name}</h1>
      </header>

      {folder.photoKeys.length === 0 ? (
        <p className="text-gray-400 text-center py-12 text-sm">No photos yet</p>
      ) : (
        <div className="grid grid-cols-3 gap-1">
          {/* Photo thumbnails rendered in a later step */}
        </div>
      )}

      <div className="fixed bottom-6 right-6">
        <AddPhotoButton folderId={folder.id} />
      </div>
    </main>
  )
}
