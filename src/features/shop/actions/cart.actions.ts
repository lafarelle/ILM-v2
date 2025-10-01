"use server";

import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

async function requireUserId() {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });
  if (!session?.user?.id) {
    throw new Error("Vous devez être connecté");
  }
  return session.user.id;
}

export async function getCart() {
  const userId = await requireUserId();
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: { product: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });
  return cart ?? { id: null, userId, items: [] };
}

export async function updateCartItem(productId: string, quantity: number) {
  const userId = await requireUserId();
  const cart = await prisma.cart.upsert({
    where: { userId },
    create: { userId },
    update: {},
  });

  const item = await prisma.cartItem.findUnique({
    where: { cartId_productId: { cartId: cart.id, productId } },
  });

  if (!item) {
    if (quantity <= 0) return { success: true };
    await prisma.cartItem.create({
      data: { cartId: cart.id, productId, quantity },
    });
    return { success: true };
  }

  if (quantity <= 0) {
    await prisma.cartItem.delete({ where: { id: item.id } });
    return { success: true };
  }

  await prisma.cartItem.update({ where: { id: item.id }, data: { quantity } });
  return { success: true };
}

export async function removeFromCart(productId: string) {
  const userId = await requireUserId();
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) return { success: true };
  const existingItem = await prisma.cartItem.findUnique({
    where: { cartId_productId: { cartId: cart.id, productId } },
  });
  if (!existingItem) return { success: true };
  await prisma.cartItem.delete({ where: { id: existingItem.id } });
  return { success: true };
}

export async function clearCart() {
  const userId = await requireUserId();
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) return { success: true };
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  return { success: true };
}
