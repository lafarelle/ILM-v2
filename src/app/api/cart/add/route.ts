import { addToCart } from "@/features/shop/actions/add-to-cart.action";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  const productId = String(formData.get("productId") || "");
  const quantityRaw = Number(formData.get("quantity") || 1);
  const quantity = Number.isFinite(quantityRaw) ? quantityRaw : 1;
  if (!productId) return NextResponse.redirect(new URL("/shop", req.url));
  await addToCart(productId, quantity);
  return NextResponse.redirect(new URL("/cart", req.url));
}
