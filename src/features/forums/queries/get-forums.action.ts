"use server";

import { prisma } from "@/lib/prisma";

export async function getForums() {
  const forums = await prisma.forum.findMany({
    orderBy: [
      { isDefault: 'desc' }, // Default forums first
      { name: 'asc' }, // Then alphabetically
    ],
    include: {
      _count: {
        select: {
          posts: true,
        },
      },
    },
  });

  return forums;
}

export async function getForumById(id: string) {
  if (!id) {
    throw new Error("ID de forum requis");
  }

  const forum = await prisma.forum.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          posts: true,
        },
      },
    },
  });

  if (!forum) {
    throw new Error("Forum non trouvé");
  }

  return forum;
}

export async function getDefaultForum() {
  const defaultForum = await prisma.forum.findFirst({
    where: { isDefault: true },
  });

  return defaultForum;
}