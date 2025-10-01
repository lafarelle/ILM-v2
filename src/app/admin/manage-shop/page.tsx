import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createArtisan } from "@/features/shop/actions/create-artisan.action";
import { createProduct } from "@/features/shop/actions/create-product.action";
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

  async function submitArtisan(formData: FormData) {
    "use server";
    await createArtisan({
      name: String(formData.get("name") || ""),
      slug: String(formData.get("slug") || ""),
      bio: (formData.get("bio") as string) || undefined,
      avatarUrl: (formData.get("avatarUrl") as string) || undefined,
    });
  }

  async function submitProduct(formData: FormData) {
    "use server";
    const category = String(formData.get("category") || "merch");
    const artisanIdRaw = (formData.get("artisanId") as string) || undefined;
    await createProduct({
      name: String(formData.get("p_name") || ""),
      slug: String(formData.get("p_slug") || ""),
      description: String(formData.get("description") || ""),
      priceCents: Number(formData.get("priceCents") || 0),
      imageUrl: (formData.get("imageUrl") as string) || undefined,
      category: category === "artisan" ? "artisan" : "merch",
      artisanId:
        category === "artisan" ? (artisanIdRaw ?? undefined) : undefined,
    });
  }

  return (
    <div className="px-8 py-16 container mx-auto max-w-screen-lg space-y-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Gérer la boutique</h1>
        <p className="text-muted-foreground">
          Ajoutez des artisans et des produits (merch ou artisan).
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Ajouter un artisan</h2>
        <form action={submitArtisan} className="grid gap-4 max-w-xl">
          <div className="grid gap-2">
            <Label htmlFor="name">Nom *</Label>
            <Input id="name" name="name" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              name="slug"
              placeholder="ex: atelier-ceramique"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" name="bio" rows={3} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="avatarUrl">Avatar URL</Label>
            <Input id="avatarUrl" name="avatarUrl" type="url" />
          </div>
          <div>
            <Button type="submit">Créer l'artisan</Button>
          </div>
        </form>

        <div className="overflow-x-auto">
          <table className="table-auto min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="px-3 py-2 text-left">Nom</th>
                <th className="px-3 py-2 text-left">Slug</th>
                <th className="px-3 py-2 text-left">Produits</th>
              </tr>
            </thead>
            <tbody>
              {artisans.map((a) => (
                <tr key={a.id} className="border-b">
                  <td className="px-3 py-2">{a.name}</td>
                  <td className="px-3 py-2">{a.slug}</td>
                  <td className="px-3 py-2">{a._count.products}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Ajouter un produit</h2>
        <form action={submitProduct} className="grid gap-4 max-w-xl">
          <div className="grid gap-2">
            <Label htmlFor="p_name">Nom *</Label>
            <Input id="p_name" name="p_name" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="p_slug">Slug *</Label>
            <Input
              id="p_slug"
              name="p_slug"
              placeholder="ex: mug-i-love-meudon"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea id="description" name="description" rows={3} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="priceCents">Prix (centimes) *</Label>
            <Input
              id="priceCents"
              name="priceCents"
              type="number"
              min={0}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input id="imageUrl" name="imageUrl" type="url" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category">Catégorie *</Label>
            <select
              id="category"
              name="category"
              className="border rounded h-9 px-3"
            >
              <option value="merch">Merch</option>
              <option value="artisan">Artisan</option>
            </select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="artisanId">Artisan (si catégorie artisan)</Label>
            <select
              id="artisanId"
              name="artisanId"
              className="border rounded h-9 px-3"
            >
              <option value="">—</option>
              {artisans.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Button type="submit">Créer le produit</Button>
          </div>
        </form>

        <div className="overflow-x-auto">
          <table className="table-auto min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="px-3 py-2 text-left">Nom</th>
                <th className="px-3 py-2 text-left">Catégorie</th>
                <th className="px-3 py-2 text-left">Artisan</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b">
                  <td className="px-3 py-2">{p.name}</td>
                  <td className="px-3 py-2">{p.category}</td>
                  <td className="px-3 py-2">{p.artisan?.name ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
