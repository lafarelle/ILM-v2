import { notFound } from "next/navigation";
import { getForumById } from "@/features/forums/queries/get-forums.action";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, MessageCircle } from "lucide-react";
import { PostForm } from "@/features/posts/components/post-form";
import { ForumPostsList } from "@/features/posts/components/posts-list";
import { ForumPostsProvider } from "@/features/posts/context/forum-posts-context";

interface ForumPageProps {
  params: {
    id: string;
  };
}

export default async function ForumPage({ params }: ForumPageProps) {
  try {
    const { id } = await params;
    const forum = await getForumById(id);

    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <CardTitle className="text-2xl">{forum.name}</CardTitle>
                  {forum.isDefault && (
                    <Badge variant="default">
                      <Star className="mr-1 h-4 w-4" />
                      Forum par défaut
                    </Badge>
                  )}
                </div>
                <CardDescription>
                  {forum.description || "Aucune description disponible pour ce forum"}
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="flex items-center text-sm text-muted-foreground gap-1">
                  <MessageCircle className="h-4 w-4" />
                  <span>{forum._count.posts} post{forum._count.posts !== 1 ? "s" : ""}</span>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <ForumPostsProvider forumId={forum.id}>
          <div className="mt-8 space-y-8">
            <PostForm 
              forumId={forum.id}
              placeholder={`Que voulez-vous partager dans ${forum.name} ?`}
            />
            
            <ForumPostsList 
              forumName={forum.name}
            />
          </div>
        </ForumPostsProvider>
      </div>
    );
  } catch {
    notFound();
  }
}

export async function generateMetadata({ params }: ForumPageProps) {
  try {
    const { id } = await params;
    const forum = await getForumById(id);
    
    return {
      title: `${forum.name} - Forum`,
      description: forum.description || `Discussions et posts du forum ${forum.name}`,
    };
  } catch {
    return {
      title: "Forum non trouvé",
      description: "Ce forum n'existe pas ou a été supprimé",
    };
  }
}