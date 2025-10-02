import { stripe } from "@/features/stripe/utils/stripe";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import type Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getWebhookSecret(): string {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) throw new Error("Missing STRIPE_WEBHOOK_SECRET");
  return secret;
}

export async function POST(req: Request) {
  const rawBody = await req.text();
  const sig = req.headers.get("stripe-signature");
  if (!sig) return new NextResponse("Missing signature", { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, getWebhookSecret());
  } catch (err) {
    console.error(err);
    return new NextResponse("Invalid signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = (session?.metadata?.userId || undefined) as
      | string
      | undefined;
    const paymentIntentId = session?.payment_intent as string | undefined;
    const sessionId = session?.id as string | undefined;
    const orderIdFromMetadata = (session?.metadata?.orderId ||
      session?.client_reference_id) as string | undefined;

    if (userId && sessionId) {
      // Build order from user's current cart to reflect purchased items
      const cart = await prisma.cart.findUnique({
        where: { userId },
        include: { items: { include: { product: true } } },
      });

      const totalCentsFromCart = cart?.items?.reduce(
        (sum, i) => sum + i.product.priceCents * i.quantity,
        0
      );

      const totalCentsFromStripe =
        (session?.amount_total as number | null) ?? null;
      const totalCents =
        typeof totalCentsFromStripe === "number"
          ? totalCentsFromStripe
          : (totalCentsFromCart ?? 0);

      // Idempotent upsert by unique stripeCheckoutSessionId
      await prisma.order.upsert({
        where: { stripeCheckoutSessionId: sessionId },
        update: {
          status: "PAID",
          stripePaymentIntentId: paymentIntentId ?? null,
        },
        create: {
          userId,
          totalCents,
          status: "PAID",
          stripeCheckoutSessionId: sessionId,
          stripePaymentIntentId: paymentIntentId ?? null,
          items: {
            create:
              cart?.items.map((i) => ({
                productId: i.productId,
                unitPriceCents: i.product.priceCents,
                quantity: i.quantity,
              })) ?? [],
          },
        },
      });

      // Clear the cart after successful order creation
      if (cart) {
        await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
      }
    }

    // Finalize pre-created order by orderId metadata (works for both flows)
    if (orderIdFromMetadata && sessionId) {
      try {
        await prisma.order.update({
          where: { id: orderIdFromMetadata },
          data: {
            status: "PAID",
            stripeCheckoutSessionId: sessionId,
            stripePaymentIntentId: paymentIntentId ?? null,
          },
        });
      } catch (e) {
        console.error("Failed to update order from metadata.orderId", e);
      }
    }
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log("checkout.session.expired", session);
    // If no order was created yet (new flow), nothing to cancel here.
  }

  return NextResponse.json({ received: true });
}
