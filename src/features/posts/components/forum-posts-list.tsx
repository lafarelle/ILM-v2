"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PostReport } from "./post-report";
import { useForumPostsContext } from "@/features/posts/context/forum-posts-context";

interface ForumPostsListProps {
  forumName: string;
}

export function ForumPostsList({ forumName }: ForumPostsListProps) {
  const { posts, loading, handlePostDeleted } = useForumPostsContext();

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