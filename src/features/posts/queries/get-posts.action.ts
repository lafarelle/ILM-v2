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
  likes: {
    userId: string;
  }[];
  _count: {
    comments: number;
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
        likes: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            comments: true,
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

export async function getPostsByForum(forumId: string): Promise<SimplePost[]> {
  try {
    const posts = await prisma.post.findMany({
      where: {
        forumId: forumId,
      },
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
        likes: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    return posts;
  } catch (error) {
    console.error("Error fetching forum posts:", error);
    throw new Error("Failed to fetch forum posts");
  }
}
