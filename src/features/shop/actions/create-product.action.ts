"use server";

import {
  createProductSchema,
  type CreateProductInput,
} from "@/features/shop/schemas/shop.schema";
import type { ProductCategory } from "@/generated/prisma";
import { auth } from "@/lib/auth/auth";
import { canUserManageAllContent } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { headers } from "next/headers";

export async function createProduct(input: CreateProductInput) {
  const headersList = await headers();

  const session = await auth.api.getSession({ headers: headersList });
  if (!session) throw new Error("Vous devez être connecté");
  if (!canUserManageAllContent(session.user.role))
    throw new Error("Accès refusé");

  const data = createProductSchema.parse(input);

  const existing = await prisma.product.findUnique({
    where: { slug: data.slug },
  });
  if (existing) throw new Error("Un produit avec ce slug existe déjà");

  if (data.category === "artisan" && data.artisanId) {
    const artisan = await prisma.artisan.findUnique({
      where: { id: data.artisanId },
    });
    if (!artisan) throw new Error("Artisan introuvable");
  }

  let category: ProductCategory;
  if (data.category === "merch") category = "MERCH";
  else if (data.category === "artisan") category = "ARTISAN";
  else category = "DROPSHIPPING";

  const product = await prisma.product.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      priceCents: data.priceCents,
      imageUrl: data.imageUrl,
      category,
      artisanId: data.category === "artisan" ? (data.artisanId ?? null) : null,
    },
  });

  revalidateTag("products");
  revalidatePath("/admin/manage-shop");
  revalidatePath("/shop");

  return product;
}
