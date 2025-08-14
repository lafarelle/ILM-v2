"use server";

import { auth } from "@/lib/auth/auth";
import { canUserDeleteComment } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function deleteComment(commentId: string) {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session?.user?.id) {
    throw new Error("You must be logged in to delete comments");
  }

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    select: {
      userId: true,
      post: {
        select: {
          userId: true,
        }
      }
    }
  });

  if (!comment) {
    throw new Error("Comment not found");
  }

  if (!canUserDeleteComment(comment.userId, comment.post.userId, session.user.id, session.user.role)) {
    throw new Error("You don't have permission to delete this comment");
  }

  await prisma.comment.delete({
    where: { id: commentId },
  });

  revalidatePath("/");
}