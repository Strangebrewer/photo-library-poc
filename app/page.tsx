import Link from "next/link";
import { prisma } from "@/lib/prisma";
import CreateFolderForm from "@/components/CreateFolderForm";

export default async function Home() {
  const folders = await prisma.folder.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="max-w-lg mx-auto px-4 py-8">
      <header className="mb-6">
        <h1 className="text-xl font-semibold">Photo Library</h1>
      </header>

      {folders.length === 0 ? (
        <p className="text-gray-400 text-center py-12 text-sm">
          No folders yet
        </p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {folders.map((folder: (typeof folders)[number]) => (
            <li key={folder.id}>
              <Link
                href={`/folders/${folder.id}`}
                className="flex items-center justify-between py-4 text-base font-medium"
              >
                <span>{folder.name}</span>
                <span className="text-gray-400">›</span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8">
        <CreateFolderForm />
      </div>
    </main>
  );
}
