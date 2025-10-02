import { clearCart } from "@/features/shop/actions/cart.actions";
import { isSameOrigin } from "@/lib/security";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  if (!isSameOrigin(req))
    return new NextResponse("Invalid origin", { status: 403 });
  await clearCart();
  return NextResponse.redirect(new URL("/cart", req.url));
}
