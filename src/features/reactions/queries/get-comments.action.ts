"use server";

import { prisma } from "@/lib/prisma";

export async function getComments(postId: string) {
  const comments = await prisma.comment.findMany({
    where: {
      postId: postId,
      parentId: null, // Only get top-level comments
    },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        }
      },
      likes: {
        select: {
          userId: true,
        }
      },
      replies: {
        include: {
          user: {
            select: {
              name: true,
              image: true,
            }
          },
          likes: {
            select: {
              userId: true,
            }
          },
        },
        orderBy: {
          createdAt: 'asc',
        }
      },
    },
    orderBy: {
      createdAt: 'desc',
    }
  });

  return comments;
}

export async function getCommentWithReplies(commentId: string) {
  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        }
      },
      likes: {
        select: {
          userId: true,
        }
      },
      replies: {
        include: {
          user: {
            select: {
              name: true,
              image: true,
            }
          },
          likes: {
            select: {
              userId: true,
            }
          },
        },
        orderBy: {
          createdAt: 'asc',
        }
      },
    },
  });

  return comment;
}