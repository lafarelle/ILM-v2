"use server";

import { uploadFileToS3 } from "@/features/r2-bucket/utils/awss3.utils";
import { createArtisan } from "@/features/shop/actions/create-artisan.action";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";

export async function submitArtisan(formData: FormData) {
  const avatarFile = formData.get("avatarFile") as File | null;

  let uploadedAvatarUrl: string | undefined;
  if (avatarFile && avatarFile.size > 0) {
    const headersListInner = await headers();
    const sessionInner = await auth.api.getSession({
      headers: headersListInner,
    });
    if (!sessionInner) throw new Error("Vous devez être connecté");

    const { url } = await uploadFileToS3({
      file: avatarFile,
      prefix: `users/${sessionInner.user.id}`,
      filename: avatarFile.name,
    });
    uploadedAvatarUrl = url;
  }

  await createArtisan({
    name: String(formData.get("name") || ""),
    slug: String(formData.get("slug") || ""),
    bio: (formData.get("bio") as string) || undefined,
    avatarUrl: uploadedAvatarUrl,
  });
}
