import { ArtisanForm } from "@/features/shop/components/artisan-form";
import { ArtisansTable } from "@/features/shop/components/artisans-table";
import { ProductForm } from "@/features/shop/components/product-form";
import { ProductsTable } from "@/features/shop/components/products-table";
import { getArtisans } from "@/features/shop/queries/get-artisans.action";
import { getProducts } from "@/features/shop/queries/get-products.action";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function ManageShopPage() {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });
  if (!session) redirect("/auth/login");
  if (session.user.role !== "ADMIN") redirect("/");

  const [artisans, products] = await Promise.all([
    getArtisans(),
    getProducts(),
  ]);

  // Forms are now in feature components with server actions

  return (
    <div className="px-8 py-16 container mx-auto max-w-screen-lg space-y-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Gérer la boutique</h1>
        <p className="text-muted-foreground">
          Ajoutez des artisans et des produits (merch ou artisan).
        </p>
      </div>

      <section className="space-y-4">
        <ArtisanForm />
        <ArtisansTable artisans={artisans} />
      </section>

      <section className="space-y-4">
        <ProductForm
          artisans={artisans.map((a) => ({ id: a.id, name: a.name }))}
        />
        <ProductsTable products={products} />
      </section>
    </div>
  );
}
