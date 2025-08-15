"use server";

import { auth } from "@/lib/auth/auth";
import { canUserCreatePost } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { uploadFileAction } from "@/features/r2-bucket/actions/upload-file.action";

export async function createPost(
  content: string, 
  forumId?: string, 
  isAnonymous?: boolean,
  authorName?: string,
  imageFile?: File
) {
  const headersList = await headers();

  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!canUserCreatePost()) {
    throw new Error("You don't have permission to create posts");
  }

  if (!content.trim()) {
    throw new Error("Post content cannot be empty");
  }

  // For anonymous posts, we don't need a user ID
  const userId = (!isAnonymous && session?.user?.id) ? session.user.id : undefined;

  // Only require authentication for non-anonymous posts
  if (!isAnonymous && !session?.user?.id) {
    throw new Error("You must be logged in to post non-anonymous posts");
  }

  // Handle image upload if provided
  let imageUrl: string | null = null;
  if (imageFile) {
    // Use a default user ID for anonymous posts if no session
    const uploadUserId = userId || 'anonymous';
    
    const formData = new FormData();
    formData.append('file', imageFile);
    
    const uploadResult = await uploadFileAction(formData, uploadUserId);
    
    if (!uploadResult.success) {
      throw new Error(`Failed to upload image: ${uploadResult.error}`);
    }
    
    imageUrl = uploadResult.url || null;
  }

  await prisma.post.create({
    data: {
      content: content.trim(),
      imageUrl,
      userId,
      forumId: forumId || null,
      isAnonymous: isAnonymous || false,
      authorName: isAnonymous ? (authorName || "Anonyme") : null,
    },
  });

  revalidatePath("/");
  if (forumId) {
    revalidatePath(`/forums/${forumId}`);
  }
}
