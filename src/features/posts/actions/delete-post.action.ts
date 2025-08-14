"use server";

import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function deletePost(postId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return {
        success: false,
        error: "Non authentifié",
        isAuthenticated: false,
      };
    }

    // First, check if the post exists and get its owner
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { userId: true },
    });

    if (!post) {
      return {
        success: false,
        error: "Post non trouvé",
        isAuthenticated: true,
        userEmail: session.user.email,
      };
    }

    // Check if the current user is the owner of the post
    if (post.userId !== session.user.id) {
      return {
        success: false,
        error: "Vous ne pouvez supprimer que vos propres posts",
        isAuthenticated: true,
        userEmail: session.user.email,
      };
    }

    // Delete the post (reports will be deleted automatically due to cascade)
    await prisma.post.delete({
      where: { id: postId },
    });

    return {
      success: true,
      isAuthenticated: true,
      userEmail: session.user.email,
    };
  } catch (error) {
    console.error("Error deleting post:", error);
    return {
      success: false,
      error: "Erreur interne du serveur",
      isAuthenticated: false,
    };
  }
}