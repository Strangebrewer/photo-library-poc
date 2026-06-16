import { Fragment } from "react";
import Link from "next/link";

type Crumb = { id: string; name: string };

export default function Breadcrumb({
  ancestors,
  current,
}: {
  ancestors: Crumb[];
  current: string;
}) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center flex-wrap gap-x-1 text-sm">
        <li>
          <Link href="/" className="text-blue-600">
            Home
          </Link>
        </li>
        {ancestors.map((crumb) => (
          <Fragment key={crumb.id}>
            <li aria-hidden className="text-gray-400">
              /
            </li>
            <li>
              <Link href={`/folders/${crumb.id}`} className="text-blue-600">
                {crumb.name}
              </Link>
            </li>
          </Fragment>
        ))}
        <li aria-hidden className="text-gray-400">
          /
        </li>
        <li>
          <strong>{current}</strong>
        </li>
      </ol>
    </nav>
  );
}
