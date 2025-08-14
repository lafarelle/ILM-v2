"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPostsByForum, type SimplePost } from "@/features/posts/queries/get-posts.action";
import { PostReport } from "./post-report";
import { useEffect, useState } from "react";

interface ForumPostsListProps {
  forumId: string;
  forumName: string;
}

export function ForumPostsList({ forumId, forumName }: ForumPostsListProps) {
  const [posts, setPosts] = useState<SimplePost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await getPostsByForum(forumId);
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching forum posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [forumId]);

  const handlePostDeleted = (postId: string) => {
    setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Posts dans {forumName}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            Loading posts...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Posts dans {forumName}</CardTitle>
      </CardHeader>
      <CardContent>
        {posts.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            Aucun post dans ce forum. Soyez le premier à créer un post !
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="border rounded-lg p-4 relative">
                <div className="mb-2">
                  <span className="font-medium">{post.user.name}</span>
                  <span className="text-sm text-muted-foreground ml-2">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="whitespace-pre-wrap">{post.content}</p>
                <PostReport 
                  postId={post.id} 
                  onPostDeleted={() => handlePostDeleted(post.id)} 
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}