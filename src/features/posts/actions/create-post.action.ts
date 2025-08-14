"use server";

import { auth } from "@/lib/auth/auth";
import { canUserCreatePost } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

// Get or create an anonymous user for unauthenticated posts
async function getAnonymousUser() {
  const anonymousEmail = "anonymous@system.local";
  
  let anonymousUser = await prisma.user.findUnique({
    where: { email: anonymousEmail },
  });

  if (!anonymousUser) {
    anonymousUser = await prisma.user.create({
      data: {
        name: "Anonymous",
        email: anonymousEmail,
        emailVerified: true,
        role: "USER",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  return anonymousUser;
}

export async function createPost(content: string, forumId?: string, forceAnonymous?: boolean) {
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

  // Use authenticated user or anonymous user based on session and forceAnonymous flag
  const userId = (session?.user?.id && !forceAnonymous) 
    ? session.user.id 
    : (await getAnonymousUser()).id;

  await prisma.post.create({
    data: {
      content: content.trim(),
      userId: userId,
      forumId: forumId || null,
    },
  });

  revalidatePath("/");
  if (forumId) {
    revalidatePath(`/forums/${forumId}`);
  }
}
