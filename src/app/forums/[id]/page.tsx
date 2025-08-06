import { notFound } from "next/navigation";
import { getForumById } from "@/features/forums/queries/get-forums.action";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, MessageCircle, Users } from "lucide-react";

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
          <CardContent>
            <div className="bg-muted/30 rounded-lg p-6 text-center">
              <div className="flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Bienvenue dans le forum {forum.name}</h3>
              <p className="text-muted-foreground">
                Cette page affiche les détails du forum. Vous pouvez ici ajouter la liste des posts,
                les fonctionnalités de création de nouveaux posts, et la pagination.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  } catch (error) {
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
  } catch (error) {
    return {
      title: "Forum non trouvé",
      description: "Ce forum n'existe pas ou a été supprimé",
    };
  }
}