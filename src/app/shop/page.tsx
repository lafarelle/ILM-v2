import { ShopLists } from "@/features/shop/components/shop-lists";
import { getArtisans } from "@/features/shop/queries/get-artisans.action";
import { getProducts } from "@/features/shop/queries/get-products.action";

export default async function ShopPage() {
  const [artisansRaw, products] = await Promise.all([
    getArtisans(),
    getProducts(),
  ]);
  const artisans = artisansRaw.map((a) => ({
    id: a.id,
    slug: a.slug,
    name: a.name,
    bio: a.bio ?? "",
    avatarUrl: a.avatarUrl ?? null,
  }));
  const normalized = products.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: p.description,
    priceCents: p.priceCents,
    imageUrl: p.imageUrl ?? null,
    category: (p.category as string).toLowerCase() as
      | "merch"
      | "artisan"
      | "dropshipping",
    artisanId: p.artisanId ?? null,
  }));

  const merchAndDropshipping = normalized.filter(
    (p) => p.category === "merch" || p.category === "dropshipping"
  );
  const artisanProducts = normalized.filter((p) => p.category === "artisan");

  return (
    <main className="container mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">produits d&apos;artisans</h1>
      <ShopLists
        artisans={artisans}
        merch={merchAndDropshipping}
        artisanProducts={artisanProducts}
      />
    </main>
  );
}
