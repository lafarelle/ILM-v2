import Link from "next/link";

interface ForumItem {
  id: string;
  name: string;
  _count: {
    posts: number;
  };
}

interface ForumsLinksListProps {
  forums: ForumItem[];
  className?: string;
}

export function ForumsLinksList({ forums, className }: ForumsLinksListProps) {
  if (!forums || forums.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Aucun forum disponible pour le moment.
      </p>
    );
  }

  return (
    <ul className={className}>
      {forums.map((forum) => (
        <li key={forum.id} className="py-2">
          <Link href={`/forums/${forum.id}`} className="hover:underline">
            {forum.name}
          </Link>
          <span className="ml-2 text-xs text-muted-foreground">
            ({forum._count.posts} message{forum._count.posts !== 1 ? "s" : ""})
          </span>
        </li>
      ))}
    </ul>
  );
}
