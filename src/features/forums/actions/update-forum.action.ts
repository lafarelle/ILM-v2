"use server";

import {
  updateForumSchema,
  type UpdateForumInput,
} from "@/features/forums/schemas/forum.schema";
import { auth } from "@/lib/auth/auth";
import { canUserManageAllContent } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { headers } from "next/headers";

export async function updateForum(input: UpdateForumInput) {
  const headersList = await headers();

  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session) {
    throw new Error("Vous devez être connecté");
  }

  if (!canUserManageAllContent(session.user.role)) {
    throw new Error("Vous n'avez pas l'autorisation de modifier des forums");
  }

  const validatedInput = updateForumSchema.parse(input);

  // Check if forum exists
  const existingForum = await prisma.forum.findUnique({
    where: { id: validatedInput.id },
  });

  if (!existingForum) {
    throw new Error("Forum non trouvé");
  }

  // If name is being updated, check for uniqueness
  if (validatedInput.name && validatedInput.name !== existingForum.name) {
    const nameExists = await prisma.forum.findFirst({
      where: {
        name: validatedInput.name,
        id: { not: validatedInput.id },
      },
    });

    if (nameExists) {
      throw new Error("Un forum avec ce nom existe déjà");
    }
  }

  // If setting as default, unset other defaults
  if (validatedInput.isDefault === true) {
    await prisma.forum.updateMany({
      where: {
        isDefault: true,
        id: { not: validatedInput.id },
      },
      data: { isDefault: false },
    });
  }

  const updateData: Record<string, string | boolean | undefined> = {};
  if (validatedInput.name !== undefined) updateData.name = validatedInput.name;
  if (validatedInput.description !== undefined)
    updateData.description = validatedInput.description;
  if (validatedInput.isDefault !== undefined)
    updateData.isDefault = validatedInput.isDefault;

  const forum = await prisma.forum.update({
    where: { id: validatedInput.id },
    data: updateData,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/dashboard");
  revalidatePath("/");
  revalidatePath("/forums");
  revalidateTag("forums");

  return forum;
}
