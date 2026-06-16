import Link from "next/link";
import { prisma } from "@/lib/prisma";
import CreateFolderForm from "@/components/CreateFolderForm";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();
  const folders = await prisma.folder.findMany({
    where: { userId: session!.user.id, parentId: null },
    orderBy: { name: "asc" },
  });

  return (
    <main className="max-w-lg mx-auto px-4 py-8">
      <header className="mb-6">
        <h1 className="text-xl font-semibold">Photo Library</h1>
      </header>

      <div className="mb-6">
        <CreateFolderForm />
      </div>

      {folders.length === 0 ? (
        <p className="text-gray-400 text-center py-12 text-sm">
          No folders yet
        </p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {folders.map((folder) => (
            <li key={folder.id}>
              <Link
                href={`/folders/${folder.id}`}
                className="flex items-center justify-between py-4 text-base font-medium"
              >
                <span>{folder.name}</span>
                <span className="text-gray-400">&gt;</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
