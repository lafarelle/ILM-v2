import { clearCart } from "@/features/shop/actions/cart.actions";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await clearCart();
  return NextResponse.redirect(new URL("/cart", req.url));
}
