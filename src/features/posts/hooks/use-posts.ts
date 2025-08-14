import { useCallback, useEffect, useState } from "react";
import { getPosts, type SimplePost } from "@/features/posts/queries/get-posts.action";

export function usePosts() {
  const [posts, setPosts] = useState<SimplePost[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    try {
      const fetchedPosts = await getPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshPosts = useCallback(() => {
    setLoading(true);
    fetchPosts();
  }, [fetchPosts]);

  const handlePostDeleted = useCallback((postId: string) => {
    setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return {
    posts,
    loading,
    refreshPosts,
    handlePostDeleted,
  };
}