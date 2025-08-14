"use server";

import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function togglePostLike(postId: string) {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session?.user?.id) {
    throw new Error("You must be logged in to like posts");
  }

  const existingLike = await prisma.postLike.findUnique({
    where: {
      userId_postId: {
        userId: session.user.id,
        postId: postId,
      },
    },
  });

  if (existingLike) {
    // Remove like
    await prisma.postLike.delete({
      where: {
        id: existingLike.id,
      },
    });
  } else {
    // Add like
    await prisma.postLike.create({
      data: {
        userId: session.user.id,
        postId: postId,
      },
    });
  }

  revalidatePath("/");
}