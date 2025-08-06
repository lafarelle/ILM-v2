"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteForum } from "@/features/forums/actions/delete-forum.action";
import { updateForum } from "@/features/forums/actions/update-forum.action";
import { Star, Trash2, MessageCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

interface Forum {
  id: string;
  name: string;
  description: string | null;
  isDefault: boolean;
  _count: {
    posts: number;
  };
}

interface ForumsListProps {
  forums: Forum[];
}

export function ForumsList({ forums }: ForumsListProps) {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {}
  );

  const setLoading = (forumId: string, loading: boolean) => {
    setLoadingStates((prev) => ({ ...prev, [forumId]: loading }));
  };

  async function handleDelete(forumId: string) {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce forum ?")) {
      return;
    }

    setLoading(forumId, true);
    try {
      await deleteForum({ id: forumId });
      toast.success("Forum supprimé avec succès");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erreur lors de la suppression"
      );
    } finally {
      setLoading(forumId, false);
    }
  }

  async function handleSetDefault(forumId: string) {
    setLoading(forumId, true);
    try {
      await updateForum({ id: forumId, isDefault: true });
      toast.success("Forum défini comme défaut");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erreur lors de la mise à jour"
      );
    } finally {
      setLoading(forumId, false);
    }
  }

  if (forums.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Aucun forum trouvé. Créez votre premier forum !
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {forums.map((forum) => (
        <div
          key={forum.id}
          className="border rounded-lg p-4 flex items-center justify-between"
        >
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Link href={`/forums/${forum.id}`} className="hover:underline">
                <h3 className="font-medium">{forum.name}</h3>
              </Link>
              {forum.isDefault ? (
                <Badge variant="default">
                  <Star className="mr-1 h-3 w-3" />
                  Défaut
                </Badge>
              ) : (
                <Badge variant="secondary">Normal</Badge>
              )}
            </div>
            <p className="text-gray-500 text-sm mt-1">
              {forum.description || "Aucune description"}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {forum._count.posts} post{forum._count.posts !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/forums/${forum.id}`}>
              <Button size="sm" variant="outline">
                <MessageCircle className="mr-1 h-4 w-4" />
                Voir le forum
              </Button>
            </Link>
            {!forum.isDefault && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleSetDefault(forum.id)}
                disabled={loadingStates[forum.id]}
              >
                <Star className="mr-1 h-4 w-4" />
                Définir comme défaut
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleDelete(forum.id)}
              disabled={loadingStates[forum.id]}
              className="text-red-600 hover:text-red-700 hover:border-red-300"
            >
              <Trash2 className="mr-1 h-4 w-4" />
              Supprimer
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
