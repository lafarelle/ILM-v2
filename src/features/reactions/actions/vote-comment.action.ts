"use server";

import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function voteComment(commentId: string, isUpvote: boolean) {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session?.user?.id) {
    throw new Error("You must be logged in to vote on comments");
  }

  const existingVote = await prisma.commentVote.findUnique({
    where: {
      userId_commentId: {
        userId: session.user.id,
        commentId: commentId,
      },
    },
  });

  if (existingVote) {
    if (existingVote.isUpvote === isUpvote) {
      // Remove vote if clicking the same vote
      await prisma.commentVote.delete({
        where: {
          id: existingVote.id,
        },
      });
    } else {
      // Update vote to the opposite
      await prisma.commentVote.update({
        where: {
          id: existingVote.id,
        },
        data: {
          isUpvote: isUpvote,
        },
      });
    }
  } else {
    // Create new vote
    await prisma.commentVote.create({
      data: {
        userId: session.user.id,
        commentId: commentId,
        isUpvote: isUpvote,
      },
    });
  }

  revalidatePath("/");
}