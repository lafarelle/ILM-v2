"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitProduct } from "@/features/shop/actions/submit-product.action";

interface ProductFormProps {
  artisans: Array<{ id: string; name: string }>;
}

export function ProductForm({ artisans }: ProductFormProps) {
  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Ajouter un produit</CardTitle>
        <CardDescription>
          Créez un produit merch ou lié à un artisan.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          action={submitProduct}
          className="grid gap-4"
          encType="multipart/form-data"
        >
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
            <Label htmlFor="imageFile">Image</Label>
            <Input
              id="imageFile"
              name="imageFile"
              type="file"
              accept="image/*"
            />
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
      </CardContent>
    </Card>
  );
}
