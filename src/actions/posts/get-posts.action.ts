"use server";

import { prisma } from "@/lib/prisma";

export type SimplePost = {
  id: string;
  content: string;
  createdAt: Date;
  user: {
    id: string;
    name: string;
  };
};

export async function getPosts(): Promise<SimplePost[]> {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw new Error("Failed to fetch posts");
  }
}
