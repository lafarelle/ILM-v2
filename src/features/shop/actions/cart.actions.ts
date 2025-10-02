"use server";

import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { cookies, headers } from "next/headers";

interface GuestCartItem {
  productId: string;
  quantity: number;
}

interface GuestCart {
  items: GuestCartItem[];
}

interface ProductLike {
  id: string;
  name: string;
  priceCents: number;
  imageUrl: string | null;
}

interface CartItemLike {
  id: string;
  cartId: string | null;
  productId: string;
  quantity: number;
  product: ProductLike;
}

interface CartLike {
  id: string | null;
  userId: string | null;
  items: CartItemLike[];
}

async function getGuestCart(): Promise<GuestCart> {
  const jar = await cookies();
  const raw = jar.get("guest_cart")?.value;
  if (!raw) return { items: [] };
  try {
    const parsed = JSON.parse(raw) as GuestCart;
    if (!Array.isArray(parsed?.items)) return { items: [] };
    return {
      items: parsed.items.filter((i) => i && i.productId && i.quantity > 0),
    };
  } catch {
    return { items: [] };
  }
}

async function setGuestCart(cart: GuestCart): Promise<void> {
  const jar = await cookies();
  const secure = process.env.NODE_ENV === "production";
  // Remove zero/negative quantities
  const normalized: GuestCart = {
    items: cart.items
      .map((i) => ({ ...i, quantity: Math.max(0, Math.trunc(i.quantity)) }))
      .filter((i) => i.quantity > 0),
  };
  if (normalized.items.length === 0) {
    jar.set("guest_cart", "", {
      httpOnly: true,
      sameSite: "lax",
      secure,
      path: "/",
      maxAge: 0,
    });
    return;
  }
  jar.set("guest_cart", JSON.stringify(normalized), {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    // 30 days
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function getCart(): Promise<CartLike> {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });
  const userId = session?.user?.id;
  if (userId) {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true },
          orderBy: { createdAt: "asc" },
        },
      },
    });
    const mapped: CartLike = cart
      ? {
          id: cart.id,
          userId,
          items: cart.items.map((ci) => ({
            id: ci.id,
            cartId: ci.cartId,
            productId: ci.productId,
            quantity: ci.quantity,
            product: {
              id: ci.product.id,
              name: ci.product.name,
              priceCents: ci.product.priceCents,
              imageUrl: ci.product.imageUrl ?? null,
            },
          })),
        }
      : { id: null, userId, items: [] };
    return mapped;
  }

  // Guest cart from cookie
  const guest = await getGuestCart();
  if (guest.items.length === 0) return { id: null, userId: null, items: [] };
  const products = await prisma.product.findMany({
    where: { id: { in: guest.items.map((i) => i.productId) } },
  });
  const productById = new Map(products.map((p) => [p.id, p] as const));
  const items: CartItemLike[] = guest.items
    .map((i) => {
      const product = productById.get(i.productId);
      if (!product) return null;
      return {
        id: `guest-${i.productId}`,
        cartId: null,
        productId: i.productId,
        quantity: i.quantity,
        product: {
          id: product.id,
          name: product.name,
          priceCents: product.priceCents,
          imageUrl: product.imageUrl ?? null,
        },
      } as CartItemLike;
    })
    .filter((v): v is CartItemLike => Boolean(v));
  return { id: null, userId: null, items };
}

export async function updateCartItem(productId: string, quantity: number) {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });
  const userId = session?.user?.id;
  if (userId) {
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

    await prisma.cartItem.update({
      where: { id: item.id },
      data: { quantity },
    });
    return { success: true };
  }

  // Guest: update cookie
  const guest = await getGuestCart();
  const existing = guest.items.find((i) => i.productId === productId);
  if (!existing) {
    if (quantity <= 0) return { success: true };
    guest.items.push({ productId, quantity });
    await setGuestCart(guest);
    return { success: true };
  }
  if (quantity <= 0) {
    const next = guest.items.filter((i) => i.productId !== productId);
    await setGuestCart({ items: next });
    return { success: true };
  }
  existing.quantity = quantity;
  await setGuestCart(guest);
  return { success: true };
}

export async function removeFromCart(productId: string) {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });
  const userId = session?.user?.id;
  if (userId) {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) return { success: true };
    const existingItem = await prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId: cart.id, productId } },
    });
    if (!existingItem) return { success: true };
    await prisma.cartItem.delete({ where: { id: existingItem.id } });
    return { success: true };
  }
  const guest = await getGuestCart();
  const next = guest.items.filter((i) => i.productId !== productId);
  await setGuestCart({ items: next });
  return { success: true };
}

export async function clearCart() {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });
  const userId = session?.user?.id;
  if (userId) {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) return { success: true };
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    return { success: true };
  }
  await setGuestCart({ items: [] });
  return { success: true };
}
