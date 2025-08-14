"use client";

import { createContext, useContext, ReactNode } from "react";
import { usePosts } from "@/features/posts/hooks/use-posts";
import type { SimplePost } from "@/features/posts/queries/get-posts.action";

interface PostsContextType {
  posts: SimplePost[];
  loading: boolean;
  refreshPosts: () => void;
  handlePostDeleted: (postId: string) => void;
}

export const PostsContext = createContext<PostsContextType | undefined>(undefined);

interface PostsProviderProps {
  children: ReactNode;
}

export function PostsProvider({ children }: PostsProviderProps) {
  const postsData = usePosts();

  return (
    <PostsContext.Provider value={postsData}>
      {children}
    </PostsContext.Provider>
  );
}

export function usePostsContext() {
  const context = useContext(PostsContext);
  if (context === undefined) {
    throw new Error("usePostsContext must be used within a PostsProvider");
  }
  return context;
}