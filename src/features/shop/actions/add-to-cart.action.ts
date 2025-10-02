"use server";

import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { cookies, headers } from "next/headers";

export async function addToCart(productId: string, quantity: number = 1) {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  const normalizedQty = Math.max(1, Math.trunc(quantity));

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    throw new Error("Produit introuvable");
  }

  if (session?.user?.id) {
    const userId = session.user.id;
    const cart = await prisma.cart.upsert({
      where: { userId },
      create: { userId },
      update: {},
    });

    const existingItem = await prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId: cart.id, productId } },
    });

    if (existingItem) {
      const nextQty = existingItem.quantity + normalizedQty;
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: nextQty },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity: normalizedQty,
        },
      });
    }

    return { success: true };
  }

  // Guest cart: store in cookie
  const jar = await cookies();
  const raw = jar.get("guest_cart")?.value;
  let items: { productId: string; quantity: number }[] = [];
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as {
        items?: { productId: string; quantity: number }[];
      };
      if (Array.isArray(parsed.items)) items = parsed.items;
    } catch {}
  }
  const found = items.find((i) => i.productId === productId);
  if (found)
    found.quantity = Math.max(1, Math.trunc(found.quantity + normalizedQty));
  else items.push({ productId, quantity: normalizedQty });
  const secure = process.env.NODE_ENV === "production";
  jar.set(
    "guest_cart",
    JSON.stringify({ items: items.filter((i) => i.quantity > 0) }),
    {
      httpOnly: true,
      sameSite: "lax",
      secure,
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    }
  );

  return { success: true };
}
