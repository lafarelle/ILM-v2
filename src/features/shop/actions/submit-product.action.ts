"use server";

import { uploadFileToS3 } from "@/features/r2-bucket/utils/awss3.utils";
import { createProduct } from "@/features/shop/actions/create-product.action";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";

export async function submitProduct(formData: FormData) {
  const category = String(formData.get("category") || "merch");
  const artisanIdRaw = (formData.get("artisanId") as string) || undefined;

  let uploadedImageUrl: string | undefined;
  const file = formData.get("imageFile") as File | null;
  if (file && file.size > 0) {
    const headersListInner = await headers();
    const sessionInner = await auth.api.getSession({
      headers: headersListInner,
    });
    if (!sessionInner) throw new Error("Vous devez être connecté");

    const { url } = await uploadFileToS3({
      file,
      prefix: `users/${sessionInner.user.id}`,
      filename: file.name,
    });
    uploadedImageUrl = url;
  }

  await createProduct({
    name: String(formData.get("p_name") || ""),
    slug: String(formData.get("p_slug") || ""),
    description: String(formData.get("description") || ""),
    priceCents: Number(formData.get("priceCents") || 0),
    imageUrl: uploadedImageUrl,
    category:
      category === "artisan"
        ? "artisan"
        : category === "dropshipping"
          ? "dropshipping"
          : "merch",
    artisanId: category === "artisan" ? (artisanIdRaw ?? undefined) : undefined,
  });
}
