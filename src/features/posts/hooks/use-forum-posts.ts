import { useCallback, useEffect, useState } from "react";
import { getPostsByForum, type SimplePost } from "@/features/posts/queries/get-posts.action";

export function useForumPosts(forumId: string) {
  const [posts, setPosts] = useState<SimplePost[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    try {
      const fetchedPosts = await getPostsByForum(forumId);
      setPosts(fetchedPosts);
    } catch (error) {
      console.error("Error fetching forum posts:", error);
    } finally {
      setLoading(false);
    }
  }, [forumId]);

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