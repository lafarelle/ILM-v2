"use server";

import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import type { ReportPostResponse } from "@/features/posts/schemas";

// Get or create an anonymous user for unauthenticated reports
async function getAnonymousUser() {
  const anonymousEmail = "anonymous@system.local";
  
  let anonymousUser = await prisma.user.findUnique({
    where: { email: anonymousEmail },
  });

  if (!anonymousUser) {
    anonymousUser = await prisma.user.create({
      data: {
        name: "Anonymous",
        email: anonymousEmail,
        emailVerified: true,
        role: "USER",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  return anonymousUser;
}

export async function reportPost(postId: string): Promise<ReportPostResponse> {
  const headersList = await headers();

  const session = await auth.api.getSession({
    headers: headersList,
  });

  const isAuthenticated = !!session?.user?.id;

  try {
    if (!postId.trim()) {
      return {
        success: false,
        error: "Post ID is required",
        isAuthenticated,
        userEmail: session?.user?.email || null
      };
    }

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return {
        success: false,
        error: "Post not found",
        isAuthenticated,
        userEmail: session?.user?.email || null
      };
    }

    // Use authenticated user or anonymous user
    const reporterId = session?.user?.id 
      ? session.user.id 
      : (await getAnonymousUser()).id;

    // Check if user already reported this post
    const existingReport = await prisma.report.findUnique({
      where: {
        postId_reporterId: {
          postId: postId,
          reporterId: reporterId,
        },
      },
    });

    if (existingReport) {
      return {
        success: false,
        error: "You have already reported this post",
        isAuthenticated,
        userEmail: session?.user?.email || null
      };
    }

    // Create the report
    await prisma.report.create({
      data: {
        postId: postId,
        reporterId: reporterId,
      },
    });

    return { 
      success: true, 
      isAuthenticated,
      userEmail: session?.user?.email || null
    };
  } catch (error) {
    console.error("Error reporting post:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
      isAuthenticated,
      userEmail: session?.user?.email || null
    };
  }
}