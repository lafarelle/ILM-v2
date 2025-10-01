"use server";

import { prisma } from "@/lib/prisma";

export async function getProducts() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      slug: true,
      name: true,
      description: true,
      priceCents: true,
      imageUrl: true,
      category: true,
      artisanId: true,
      artisan: { select: { id: true, name: true } },
    },
  });

  return products;
}
