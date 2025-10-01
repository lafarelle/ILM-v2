"use server";

import { auth } from "@/lib/auth/auth";
import { canUserManageAllContent } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { headers } from "next/headers";

export async function deleteArtisan(artisanId: string) {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });
  if (!session) throw new Error("Vous devez être connecté");
  if (!canUserManageAllContent(session.user.role))
    throw new Error("Accès refusé");

  await prisma.artisan.delete({ where: { id: artisanId } });

  revalidateTag("artisans");
  revalidateTag("products");
  revalidatePath("/admin/manage-shop");
  revalidatePath("/shop");
}
