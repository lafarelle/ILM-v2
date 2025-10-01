import { stripe } from "@/features/stripe/utils/stripe";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  const userId = session.user.id;

  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: { include: { product: true } } },
  });

  if (!cart || cart.items.length === 0) {
    return NextResponse.redirect(new URL("/cart", req.url));
  }

  const lineItems = cart.items.map((item) => ({
    price_data: {
      currency: "eur",
      product_data: {
        name: item.product.name,
        metadata: {
          productId: item.productId,
        },
      },
      unit_amount: item.product.priceCents,
    },
    quantity: item.quantity,
  }));

  const totalCents = cart.items.reduce(
    (sum, i) => sum + i.product.priceCents * i.quantity,
    0
  );

  const sessionStripe = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: lineItems,
    success_url: `${new URL(req.url).origin}/cart?success=1&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${new URL(req.url).origin}/cart?canceled=1`,
    client_reference_id: userId,
    metadata: { userId },
  });

  return NextResponse.redirect(sessionStripe.url || new URL("/cart", req.url), {
    status: 303,
  });
}
