import type { Metadata } from "next";
import "./globals.css";
import { auth } from "@/auth";
import LogoutButton from "@/components/LogoutButton";

export const metadata: Metadata = {
  title: "Photo Library",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-white text-gray-900">
        {session && (
          <div className="flex items-center justify-end gap-3 px-4 py-2 border-b border-gray-100">
            <span className="text-sm text-gray-500">{session.user.name}</span>
            <LogoutButton />
          </div>
        )}
        {children}
      </body>
    </html>
  );
}
