import { Button } from "@/components/ui/button";
import { ProductCard } from "@/features/shop/components/product-card";
import {
  getAllShopSlugs,
  getArtisanBySlug,
  getProductBySlug,
} from "@/features/shop/queries/get-by-slug.action";
import { getProductsByArtisanId } from "@/features/shop/queries/get-products-by-artisan.action";
import type { Product } from "@/features/shop/types";
import Image from "next/image";
import Link from "next/link";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllShopSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function ShopDetailPage({ params }: PageProps) {
  const { slug } = await params;
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

  const artisanProducts = artisan
    ? await getProductsByArtisanId(artisan.id)
    : [];

  const normalizedArtisanProducts: Product[] = artisanProducts.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: p.description,
    priceCents: p.priceCents,
    imageUrl: p.imageUrl,
    category: (p.category as string).toLowerCase() as "merch" | "artisan",
    artisanId: p.artisanId,
  }));

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

      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-4">
          Produits de {artisan?.name}
        </h2>
        {normalizedArtisanProducts.length === 0 ? (
          <p className="text-muted-foreground">Aucun produit pour le moment.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {normalizedArtisanProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
