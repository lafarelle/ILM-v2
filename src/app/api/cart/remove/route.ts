import { removeFromCart } from "@/features/shop/actions/cart.actions";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  const productId = String(formData.get("productId") || "");
  if (!productId) return NextResponse.redirect(new URL("/cart", req.url));
  await removeFromCart(productId);
  return NextResponse.redirect(new URL("/cart", req.url));
}
