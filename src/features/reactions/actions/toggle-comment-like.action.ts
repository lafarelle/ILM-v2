"use server";

import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function toggleCommentLike(commentId: string) {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session?.user?.id) {
    throw new Error("You must be logged in to like comments");
  }

  const existingLike = await prisma.commentLike.findUnique({
    where: {
      userId_commentId: {
        userId: session.user.id,
        commentId: commentId,
      },
    },
  });

  if (existingLike) {
    // Remove like
    await prisma.commentLike.delete({
      where: {
        id: existingLike.id,
      },
    });
    return { liked: false };
  } else {
    // Add like
    await prisma.commentLike.create({
      data: {
        userId: session.user.id,
        commentId: commentId,
      },
    });
    return { liked: true };
  }
}