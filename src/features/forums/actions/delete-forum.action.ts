"use server";

import {
  deleteForumSchema,
  type DeleteForumInput,
} from "@/features/forums/schemas/forum.schema";
import { auth } from "@/lib/auth/auth";
import { canUserManageAllContent } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { headers } from "next/headers";

export async function deleteForum(input: DeleteForumInput) {
  const headersList = await headers();

  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session) {
    throw new Error("Vous devez être connecté");
  }

  if (!canUserManageAllContent(session.user.role)) {
    throw new Error("Vous n'avez pas l'autorisation de supprimer des forums");
  }

  const validatedInput = deleteForumSchema.parse(input);

  // Check if forum exists
  const existingForum = await prisma.forum.findUnique({
    where: { id: validatedInput.id },
    include: {
      _count: {
        select: {
          posts: true,
        },
      },
    },
  });

  if (!existingForum) {
    throw new Error("Forum non trouvé");
  }

  // Check if there are posts in this forum
  if (existingForum._count.posts > 0) {
    throw new Error(
      "Impossible de supprimer un forum contenant des posts. Veuillez d'abord déplacer ou supprimer les posts."
    );
  }

  // Don't allow deletion if it's the only forum
  const totalForums = await prisma.forum.count();
  if (totalForums <= 1) {
    throw new Error("Impossible de supprimer le dernier forum");
  }

  const wasDefault = existingForum.isDefault;

  await prisma.forum.delete({
    where: { id: validatedInput.id },
  });

  // If deleted forum was default, set another forum as default
  if (wasDefault) {
    const firstForum = await prisma.forum.findFirst({
      orderBy: { createdAt: "asc" },
    });

    if (firstForum) {
      await prisma.forum.update({
        where: { id: firstForum.id },
        data: { isDefault: true },
      });
    }
  }

  revalidatePath("/admin");
  revalidatePath("/admin/dashboard");
  revalidatePath("/");
  revalidatePath("/forums");
  revalidateTag("forums");

  return { success: true };
}
