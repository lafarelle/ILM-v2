"use server";

import { prisma } from "@/lib/prisma";

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    select: {
      id: true,
      slug: true,
      name: true,
      description: true,
      priceCents: true,
      imageUrl: true,
      category: true,
      artisanId: true,
    },
  });
}

export async function getArtisanBySlug(slug: string) {
  return prisma.artisan.findUnique({
    where: { slug },
    select: {
      id: true,
      slug: true,
      name: true,
      bio: true,
      avatarUrl: true,
    },
  });
}

export async function getAllShopSlugs() {
  const [productSlugs, artisanSlugs] = await Promise.all([
    prisma.product.findMany({ select: { slug: true } }),
    prisma.artisan.findMany({ select: { slug: true } }),
  ]);

  return [
    ...productSlugs.map((p) => p.slug),
    ...artisanSlugs.map((a) => a.slug),
  ];
}
