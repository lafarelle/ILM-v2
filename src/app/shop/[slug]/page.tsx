import { Button } from "@/components/ui/button";
import {
  getAllShopSlugs,
  getArtisanBySlug,
  getProductBySlug,
} from "@/features/shop/queries/get-by-slug.action";
import Image from "next/image";
import Link from "next/link";

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const slugs = await getAllShopSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function ShopDetailPage({ params }: PageProps) {
  const { slug } = params;
  const [product, artisan] = await Promise.all([
    getProductBySlug(slug),
    getArtisanBySlug(slug),
  ]);

  if (!product && !artisan) {
    return (
      <main className="container mx-auto max-w-3xl px-4 py-10">
        <p className="text-muted-foreground">Aucun élément trouvé.</p>
        <Button asChild className="mt-4">
          <Link href="/shop">Retour au magasin</Link>
        </Button>
      </main>
    );
  }

  if (product) {
    return (
      <main className="container mx-auto max-w-3xl px-4 py-10">
        <div className="flex gap-6">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={320}
              height={320}
              className="rounded-lg object-cover"
            />
          ) : null}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-muted-foreground mb-4">{product.description}</p>
            <Button asChild>
              <Link href="/shop">Ajouter au panier (fake)</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto max-w-3xl px-4 py-10">
      <div className="flex gap-6">
        {artisan?.avatarUrl ? (
          <Image
            src={artisan.avatarUrl}
            alt={artisan.name}
            width={160}
            height={160}
            className="rounded-lg object-cover"
          />
        ) : null}
        <div>
          <h1 className="text-3xl font-bold mb-2">{artisan?.name}</h1>
          <p className="text-muted-foreground mb-4">{artisan?.bio}</p>
          <Button asChild>
            <Link href="/shop">Voir les produits</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
