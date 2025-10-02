import { updateCartItem } from "@/features/shop/actions/cart.actions";
import { isSameOrigin } from "@/lib/security";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  if (!isSameOrigin(req))
    return new NextResponse("Invalid origin", { status: 403 });
  const formData = await req.formData();
  const productId = String(formData.get("productId") || "");
  const quantityRaw = Number(formData.get("quantity") || NaN);
  const quantity = Number.isFinite(quantityRaw) ? Math.max(0, quantityRaw) : 0;
  if (!productId) return NextResponse.redirect(new URL("/cart", req.url));
  await updateCartItem(productId, quantity);
  return NextResponse.redirect(new URL("/cart", req.url));
}
