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

export async function getMyOrders() {
  const userId = await requireUserId();
  return prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: true } } },
  });
}

export async function getOrderById(orderId: string) {
  const userId = await requireUserId();
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { product: true } } },
  });
  if (!order || order.userId !== userId) {
    throw new Error("Commande introuvable");
  }
  return order;
}

export async function getOrderByStripeSessionId(sessionId: string) {
  // Allow both guest and logged-in success views by not requiring auth here
  const order = await prisma.order.findUnique({
    where: { stripeCheckoutSessionId: sessionId },
    include: { items: { include: { product: true } } },
  });
  return order;
}

export async function getLatestPaidOrder() {
  const userId = await requireUserId();
  const order = await prisma.order.findFirst({
    where: { userId, status: "PAID" },
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: true } } },
  });
  return order;
}
