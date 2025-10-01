"use server";

import { prisma } from "@/lib/prisma";

export async function getArtisans() {
  const artisans = await prisma.artisan.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      slug: true,
      name: true,
      bio: true,
      avatarUrl: true,
      _count: { select: { products: true } },
    },
  });

  return artisans;
}
