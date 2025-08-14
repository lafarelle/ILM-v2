"use server";

import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function createComment(
  postId: string, 
  content: string, 
  parentId?: string,
  isAnonymous?: boolean,
  authorName?: string
) {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!content.trim()) {
    throw new Error("Comment content cannot be empty");
  }

  // For anonymous comments, we don't need a user ID
  const userId = (!isAnonymous && session?.user?.id) ? session.user.id : null;

  if (!isAnonymous && !userId) {
    throw new Error("You must be logged in to post non-anonymous comments");
  }

  const comment = await prisma.comment.create({
    data: {
      content: content.trim(),
      postId,
      parentId: parentId || null,
      userId,
      isAnonymous: isAnonymous || false,
      authorName: isAnonymous ? (authorName || "Anonyme") : null,
    },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        }
      },
      votes: true,
      replies: {
        include: {
          user: {
            select: {
              name: true,
              image: true,
            }
          },
          votes: true,
        }
      }
    }
  });

  revalidatePath("/");
  return comment;
}