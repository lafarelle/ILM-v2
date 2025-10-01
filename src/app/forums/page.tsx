import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ForumsLinksList } from "@/features/forums/components/forums-links-list";
import { getForums } from "@/features/forums/queries/get-forums.action";

export default async function ForumsPage() {
  const forums = await getForums();

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Forums</CardTitle>
          <CardDescription>
            Parcourez les forums de la communauté. Sélectionnez un forum pour
            voir et publier des messages.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Liste simple des forums ci-dessous. Le nombre de messages est
            indiqué entre parenthèses.
          </p>
          <ForumsLinksList forums={forums} />
        </CardContent>
      </Card>
    </div>
  );
}

export const metadata = {
  title: "Forums - Liste des forums",
  description:
    "Découvrez tous les forums disponibles et participez aux discussions communautaires",
};
