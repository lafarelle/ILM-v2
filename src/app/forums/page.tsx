import { getForums } from "@/features/forums/queries/get-forums.action";
import { ForumsList } from "@/features/forums/components/forums-list";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ForumsPage() {
  const forums = await getForums();

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Forums</CardTitle>
          <CardDescription>
            Découvrez tous les forums disponibles et participez aux discussions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ForumsList forums={forums} />
        </CardContent>
      </Card>
    </div>
  );
}

export const metadata = {
  title: "Forums - Liste des forums",
  description: "Découvrez tous les forums disponibles et participez aux discussions communautaires",
};