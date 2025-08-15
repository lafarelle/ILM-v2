"use server";

import { auth } from "@/lib/auth/auth";
import { canUserCreatePost } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function createPost(
  content: string, 
  forumId?: string, 
  isAnonymous?: boolean,
  authorName?: string
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

  if (!isAnonymous && !userId) {
    throw new Error("You must be logged in to post non-anonymous posts");
  }

  await prisma.post.create({
    data: {
      content: content.trim(),
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
