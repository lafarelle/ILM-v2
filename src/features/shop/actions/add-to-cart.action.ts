"use server";

import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function addToCart(productId: string, quantity: number = 1) {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  if (!session?.user?.id) {
    throw new Error("Vous devez être connecté pour ajouter au panier");
  }

  const userId = session.user.id;

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    throw new Error("Produit introuvable");
  }

  const cart = await prisma.cart.upsert({
    where: { userId },
    create: { userId },
    update: {},
  });

  const existingItem = await prisma.cartItem.findUnique({
    where: { cartId_productId: { cartId: cart.id, productId } },
  });

  if (existingItem) {
    const nextQty = existingItem.quantity + Math.max(1, quantity);
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: nextQty },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity: Math.max(1, quantity),
      },
    });
  }

  return { success: true };
}
