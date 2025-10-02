import { CheckoutContactSchema } from "@/features/orders/schemas/order.schemas";
import { getCart } from "@/features/shop/actions/cart.actions";
import { stripe } from "@/features/stripe/utils/stripe";
import { prisma } from "@/lib/prisma";
import { isSameOrigin } from "@/lib/security";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  if (!isSameOrigin(req))
    return new NextResponse("Invalid origin", { status: 403 });
  const contentType = req.headers.get("content-type") || "";
  let input: {
    firstName: string;
    lastName: string;
    phone: string;
    location: string;
  };
  if (contentType.includes("application/json")) {
    const body = await req.json().catch(() => ({}));
    input = {
      firstName: String(body.firstName || "").trim(),
      lastName: String(body.lastName || "").trim(),
      phone: String(body.phone || "").trim(),
      location: String(body.location || "").trim(),
    };
  } else {
    const formData = await req.formData();
    input = {
      firstName: String(formData.get("firstName") || "").trim(),
      lastName: String(formData.get("lastName") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      location: String(formData.get("location") || "").trim(),
    };
  }

  const parsed = CheckoutContactSchema.safeParse(input);
  if (!parsed.success) {
    return NextResponse.redirect(
      new URL("/cart?error=invalid_guest_form", req.url)
    );
  }

  // Read cart from cookie (guest) or DB (if logged accidentally)
  const cart = await getCart();
  if (!cart.items.length) {
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

  // Pre-create a pending order with contact details; link via stripe session id later
  const order = await prisma.order.create({
    data: {
      totalCents,
      status: "REQUIRES_PAYMENT",
      contactFirstName: parsed.data.firstName,
      contactLastName: parsed.data.lastName,
      contactPhone: parsed.data.phone,
      contactLocation: parsed.data.location,
      items: {
        create: cart.items.map((i) => ({
          productId: i.productId,
          unitPriceCents: i.product.priceCents,
          quantity: i.quantity,
        })),
      },
    },
  });

  const sessionStripe = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: lineItems,
    success_url: `${new URL(req.url).origin}/cart?success=1&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${new URL(req.url).origin}/cart?canceled=1`,
    client_reference_id: order.id,
    metadata: {
      orderId: order.id,
      guest: "1",
    },
  });

  return NextResponse.redirect(sessionStripe.url || new URL("/cart", req.url), {
    status: 303,
  });
}
