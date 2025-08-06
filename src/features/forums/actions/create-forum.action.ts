"use server";

import {
  createForumSchema,
  type CreateForumInput,
} from "@/features/forums/schemas/forum.schema";
import { auth } from "@/lib/auth/auth";
import { canUserManageAllContent } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { headers } from "next/headers";

export async function createForum(input: CreateForumInput) {
  const headersList = await headers();

  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session) {
    throw new Error("Vous devez être connecté");
  }

  if (!canUserManageAllContent(session.user.role)) {
    throw new Error("Vous n'avez pas l'autorisation de créer des forums");
  }

  const validatedInput = createForumSchema.parse(input);

  // Check if a forum with this name already exists
  const existingForum = await prisma.forum.findUnique({
    where: { name: validatedInput.name },
  });

  if (existingForum) {
    throw new Error("Un forum avec ce nom existe déjà");
  }

  // If this is the first forum or marked as default, set it as default
  const forumCount = await prisma.forum.count();
  const shouldBeDefault = forumCount === 0 || validatedInput.isDefault;

  // If setting as default, unset other defaults
  if (shouldBeDefault) {
    await prisma.forum.updateMany({
      where: { isDefault: true },
      data: { isDefault: false },
    });
  }

  const forum = await prisma.forum.create({
    data: {
      name: validatedInput.name,
      description: validatedInput.description,
      isDefault: shouldBeDefault,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/dashboard");
  revalidatePath("/");
  revalidatePath("/forums");
  revalidateTag("forums");

  return forum;
}
