import Link from "next/link";
import { MessageCircle } from "lucide-react";

interface Forum {
  id: string;
  name: string;
  description: string | null;
  isDefault: boolean;
  _count: {
    posts: number;
  };
}

interface ForumsPreviewProps {
  forums: Forum[];
}

export function ForumsPreview({ forums }: ForumsPreviewProps) {
  if (forums.length === 0) {
    return null;
  }

  return (
    <div className="mt-16">
      <h3 className="text-xl font-semibold text-center mb-6 text-foreground">
        Découvrez nos forums
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {forums.slice(0, 6).map((forum) => (
          <Link
            key={forum.id}
            href={`/forums/${forum.id}`}
            className="group block p-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50 hover:shadow-md transition-all duration-200 hover:bg-white dark:hover:bg-gray-800"
          >
            <div className="flex items-center gap-3 mb-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                {forum.name}
              </h4>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {forum.description || "Participez aux discussions"}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {forum._count.posts} post{forum._count.posts !== 1 ? "s" : ""}
            </p>
          </Link>
        ))}
      </div>
      {forums.length > 6 && (
        <div className="text-center mt-6">
          <Link
            href="/forums"
            className="inline-flex items-center text-primary hover:text-primary/80 font-medium text-sm transition-colors"
          >
            Voir tous les forums →
          </Link>
        </div>
      )}
    </div>
  );
}