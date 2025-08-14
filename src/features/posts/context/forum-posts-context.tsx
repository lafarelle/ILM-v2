"use client";

import { createContext, useContext, ReactNode } from "react";
import { useForumPosts } from "@/features/posts/hooks/use-forum-posts";
import type { SimplePost } from "@/features/posts/queries/get-posts.action";

interface ForumPostsContextType {
  posts: SimplePost[];
  loading: boolean;
  refreshPosts: () => void;
  handlePostDeleted: (postId: string) => void;
  forumId: string;
}

export const ForumPostsContext = createContext<ForumPostsContextType | undefined>(undefined);

interface ForumPostsProviderProps {
  children: ReactNode;
  forumId: string;
}

export function ForumPostsProvider({ children, forumId }: ForumPostsProviderProps) {
  const postsData = useForumPosts(forumId);

  return (
    <ForumPostsContext.Provider value={{ ...postsData, forumId }}>
      {children}
    </ForumPostsContext.Provider>
  );
}

export function useForumPostsContext() {
  const context = useContext(ForumPostsContext);
  if (context === undefined) {
    throw new Error("useForumPostsContext must be used within a ForumPostsProvider");
  }
  return context;
}