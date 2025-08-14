"use server";

import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function checkPostOwnership(postId: string): Promise<{
  isOwner: boolean;
  isAuthenticated: boolean;
  userId?: string;
}> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return {
        isOwner: false,
        isAuthenticated: false,
      };
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { userId: true },
    });

    if (!post) {
      return {
        isOwner: false,
        isAuthenticated: true,
        userId: session.user.id,
      };
    }

    return {
      isOwner: post.userId === session.user.id,
      isAuthenticated: true,
      userId: session.user.id,
    };
  } catch (error) {
    console.error("Error checking post ownership:", error);
    return {
      isOwner: false,
      isAuthenticated: false,
    };
  }
}