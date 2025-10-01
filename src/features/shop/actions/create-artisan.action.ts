"use server";

import {
  createArtisanSchema,
  type CreateArtisanInput,
} from "@/features/shop/schemas/shop.schema";
import { auth } from "@/lib/auth/auth";
import { canUserManageAllContent } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { headers } from "next/headers";

export async function createArtisan(input: CreateArtisanInput) {
  const headersList = await headers();

  const session = await auth.api.getSession({ headers: headersList });
  if (!session) throw new Error("Vous devez être connecté");
  if (!canUserManageAllContent(session.user.role))
    throw new Error("Accès refusé");

  const data = createArtisanSchema.parse(input);

  const existing = await prisma.artisan.findUnique({
    where: { slug: data.slug },
  });
  if (existing) throw new Error("Un artisan avec ce slug existe déjà");

  const artisan = await prisma.artisan.create({
    data: {
      name: data.name,
      slug: data.slug,
      bio: data.bio,
      avatarUrl: data.avatarUrl,
    },
  });

  revalidateTag("artisans");
  revalidatePath("/admin/manage-shop");
  revalidatePath("/shop");

  return artisan;
}
