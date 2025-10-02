import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getLatestPaidOrder,
  getOrderByStripeSessionId,
} from "@/features/orders/queries/orders.queries";

import { clearCart, getCart } from "@/features/shop/actions/cart.actions";
import { stripe } from "@/features/stripe/utils/stripe";
import { formatPrice } from "@/utils/format";
import Image from "next/image";
import Link from "next/link";
import type Stripe from "stripe";

interface SearchParams {
  [key: string]: string | string[] | undefined;
}

export default async function CartPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const successParam = Array.isArray(sp?.success)
    ? sp.success[0]
    : (sp?.success as string | undefined);
  const sessionIdParam = Array.isArray(sp?.session_id)
    ? sp.session_id[0]
    : (sp?.session_id as string | undefined);

  const isSuccess = successParam === "1";

  if (isSuccess) {
    const order = sessionIdParam
      ? await getOrderByStripeSessionId(sessionIdParam)
      : await getLatestPaidOrder();

    const session: Stripe.Checkout.Session | null = sessionIdParam
      ? await stripe.checkout.sessions.retrieve(sessionIdParam, {
          expand: ["payment_intent", "payment_intent.latest_charge"],
        })
      : null;

    const amountTotal = session?.amount_total ?? order?.totalCents ?? 0;
    let paymentIntentId: string | undefined =
      order?.stripePaymentIntentId ?? undefined;
    let brand: string | undefined;
    let last4: string | undefined;

    if (session?.payment_intent) {
      if (typeof session.payment_intent === "string") {
        paymentIntentId = session.payment_intent;
      } else {
        const pi = session.payment_intent as Stripe.PaymentIntent;
        paymentIntentId = pi.id;
        const latestCharge = pi.latest_charge;
        if (latestCharge && typeof latestCharge !== "string") {
          const pmDetails = latestCharge.payment_method_details;
          const card = pmDetails?.card;
          if (card) {
            brand = card.brand ?? undefined;
            last4 = card.last4 ?? undefined;
          }
        }
      }
    }

    // Fallback: ensure the cart is cleared after successful payment in case webhook didn't run
    try {
      await clearCart();
    } catch {
      // ignore
    }

    return (
      <main className="container mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Paiement réussi</h1>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Résumé de la transaction
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <div className="flex items-center justify-between py-1">
                <span>Montant</span>
                <span className="font-medium">{formatPrice(amountTotal)}</span>
              </div>
              {paymentIntentId ? (
                <div className="flex items-center justify-between py-1">
                  <span>ID de transaction</span>
                  <span className="font-mono text-xs">{paymentIntentId}</span>
                </div>
              ) : null}
              {brand || last4 ? (
                <div className="flex items-center justify-between py-1">
                  <span>Méthode de paiement</span>
                  <span>
                    {brand ? brand.toUpperCase() : "Carte"}
                    {last4 ? ` •••• ${last4}` : ""}
                  </span>
                </div>
              ) : null}
            </div>

            {order ? (
              <div className="pt-2">
                <div className="mb-2 text-sm text-muted-foreground">
                  <span>Commande</span>{" "}
                  <span className="font-mono text-xs">#{order.id}</span>
                </div>
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="truncate mr-2">
                        {item.product?.name ?? "Article"}
                      </span>
                      <span className="text-muted-foreground">
                        {formatPrice(item.unitPriceCents)} × {item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="flex gap-3 pt-4">
              <Button asChild variant="outline">
                <Link href="/shop">Continuer mes achats</Link>
              </Button>
              <Button asChild className="ml-auto">
                <Link href="/profile">Aller au profil</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }
  const cart = await getCart();
  const items = cart?.items ?? [];
  const totalCents = items.reduce(
    (sum, i) => sum + i.product.priceCents * i.quantity,
    0
  );

  return (
    <main className="container mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Mon panier</h1>
      {items.length === 0 ? (
        <div className="text-muted-foreground">
          <p>Votre panier est vide.</p>
          <Button asChild className="mt-4">
            <Link href="/shop">Continuer mes achats</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle className="text-base flex items-center justify-between">
                  <span>{item.product.name}</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    {formatPrice(item.product.priceCents)} x {item.quantity}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex gap-4 items-center">
                {item.product.imageUrl ? (
                  <Image
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    width={96}
                    height={96}
                    className="rounded-md object-cover"
                  />
                ) : null}
                <div className="ml-auto flex items-center gap-2">
                  <form action="/api/cart/update" method="post">
                    <input
                      type="hidden"
                      name="productId"
                      value={item.productId}
                    />
                    <input
                      type="hidden"
                      name="quantity"
                      value={Math.max(0, item.quantity - 1)}
                    />
                    <Button
                      type="submit"
                      variant="outline"
                      aria-label="Diminuer la quantité"
                    >
                      -
                    </Button>
                  </form>
                  <span className="min-w-[2ch] text-center" aria-live="polite">
                    {item.quantity}
                  </span>
                  <form action="/api/cart/update" method="post">
                    <input
                      type="hidden"
                      name="productId"
                      value={item.productId}
                    />
                    <input
                      type="hidden"
                      name="quantity"
                      value={item.quantity + 1}
                    />
                    <Button
                      type="submit"
                      variant="outline"
                      aria-label="Augmenter la quantité"
                    >
                      +
                    </Button>
                  </form>
                  <form action="/api/cart/remove" method="post">
                    <input
                      type="hidden"
                      name="productId"
                      value={item.productId}
                    />
                    <Button type="submit" variant="ghost">
                      Retirer
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          ))}

          <Card>
            <CardContent className="flex items-center justify-between py-4">
              <span className="font-medium">Total</span>
              <span>{formatPrice(totalCents)}</span>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-6">
            <div className="flex gap-3">
              <form action="/api/cart/clear" method="post">
                <Button variant="outline" type="submit">
                  Vider le panier
                </Button>
              </form>
            </div>

            {cart.userId ? null : (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Payer en tant qu&apos;invité
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form
                    action="/api/stripe/guest-checkout"
                    method="post"
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <div>
                      <label htmlFor="firstName" className="block text-sm mb-1">
                        Prénom
                      </label>
                      <input
                        id="firstName"
                        name="firstName"
                        required
                        className="w-full rounded-md border px-3 py-2"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm mb-1">
                        Nom
                      </label>
                      <input
                        id="lastName"
                        name="lastName"
                        required
                        className="w-full rounded-md border px-3 py-2"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="phone" className="block text-sm mb-1">
                        Téléphone
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        required
                        className="w-full rounded-md border px-3 py-2"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="location" className="block text-sm mb-1">
                        Adresse / Localisation
                      </label>
                      <input
                        id="location"
                        name="location"
                        required
                        className="w-full rounded-md border px-3 py-2"
                      />
                    </div>
                    <div className="md:col-span-2 flex justify-end">
                      <Button type="submit">Payer avec Stripe (invité)</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {cart.userId ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Payer (connecté)</CardTitle>
                </CardHeader>
                <CardContent>
                  <form
                    action="/api/stripe/checkout"
                    method="post"
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <div>
                      <label
                        htmlFor="firstName2"
                        className="block text-sm mb-1"
                      >
                        Prénom
                      </label>
                      <input
                        id="firstName2"
                        name="firstName"
                        required
                        className="w-full rounded-md border px-3 py-2"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName2" className="block text-sm mb-1">
                        Nom
                      </label>
                      <input
                        id="lastName2"
                        name="lastName"
                        required
                        className="w-full rounded-md border px-3 py-2"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="phone2" className="block text-sm mb-1">
                        Téléphone
                      </label>
                      <input
                        id="phone2"
                        name="phone"
                        required
                        className="w-full rounded-md border px-3 py-2"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="location2" className="block text-sm mb-1">
                        Adresse / Localisation
                      </label>
                      <input
                        id="location2"
                        name="location"
                        required
                        className="w-full rounded-md border px-3 py-2"
                      />
                    </div>
                    <div className="md:col-span-2 flex justify-end">
                      <Button type="submit">
                        Payer avec Stripe (connecté)
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            ) : null}
          </div>
        </div>
      )}
    </main>
  );
}
