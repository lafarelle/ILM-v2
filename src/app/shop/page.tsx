import { ShopLists } from "@/features/shop/components/shop-lists";
import { getArtisans } from "@/features/shop/queries/get-artisans.action";
import { getProducts } from "@/features/shop/queries/get-products.action";

export default async function ShopPage() {
  const [artisans, products] = await Promise.all([
    getArtisans(),
    getProducts(),
  ]);
  const merch = products.filter((p) => p.category === "MERCH");
  const artisanProducts = products.filter((p) => p.category === "ARTISAN");

  return (
    <main className="container mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Magasin</h1>
      <p className="text-muted-foreground mb-8">
        Découvrez les artisans de Meudon et notre sélection de merch.
      </p>
      <ShopLists
        artisans={artisans}
        merch={merch}
        artisanProducts={artisanProducts}
      />
    </main>
  );
}
