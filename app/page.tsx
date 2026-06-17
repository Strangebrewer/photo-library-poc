import Link from "next/link";
import { prisma } from "@/lib/prisma";
import CreateFolderForm from "@/components/CreateFolderForm";
import AddPhotoButton from "@/components/AddPhotoButton";
import DeleteFolderButton from "@/components/DeleteFolderButton";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();
  const folders = await prisma.folder.findMany({
    where: { userId: session!.user.id, parentId: null },
    orderBy: { name: "asc" },
    include: { _count: { select: { children: true, photos: true } } },
  });

  return (
    <main className="max-w-lg mx-auto px-4 py-8">
      <header className="mb-6">
        <h1 className="text-xl font-semibold">Photo Library</h1>
      </header>

      <div className="mb-6">
        <CreateFolderForm />
      </div>

      {!folders.length ? (
        <p className="text-gray-400 text-center py-12 text-sm">
          No folders yet
        </p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {folders.map((folder) => (
            <li key={folder.id} className="flex items-center">
              <DeleteFolderButton
                folderId={folder.id}
                folderName={folder.name}
                canDelete={folder._count.children === 0 && folder._count.photos === 0}
              />
              <Link
                href={`/folders/${folder.id}`}
                className="flex-1 flex items-center justify-between py-2.5 text-base font-medium"
              >
                <span>{folder.name}</span>
                <span className="text-gray-400">&gt;</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <div className="fixed bottom-6 right-6">
        <AddPhotoButton disabled={folders.length === 0} />
      </div>
    </main>
  );
}
