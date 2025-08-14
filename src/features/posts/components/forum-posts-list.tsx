"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PostReport } from "./post-report";
import { useForumPostsContext } from "@/features/posts/context/forum-posts-context";
import { PostLikeButton } from "@/features/reactions/components/post-like-button";
import { CommentsList } from "@/features/reactions/components/comments-list";
import { MessageCircle } from "lucide-react";
import { useState } from "react";

interface ForumPostsListProps {
  forumName: string;
}

export function ForumPostsList({ forumName }: ForumPostsListProps) {
  const { posts, loading, handlePostDeleted, refreshPosts } = useForumPostsContext();
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());

  const toggleComments = (postId: string) => {
    const newExpandedComments = new Set(expandedComments);
    if (newExpandedComments.has(postId)) {
      newExpandedComments.delete(postId);
    } else {
      newExpandedComments.add(postId);
    }
    setExpandedComments(newExpandedComments);
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
          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post.id} className="space-y-4">
                <div className="border rounded-lg p-4 relative">
                  <div className="mb-2">
                    <span className="font-medium">{post.user.name}</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap mb-3">{post.content}</p>
                  
                  <div className="flex items-center gap-2">
                    <PostLikeButton
                      postId={post.id}
                      likes={post.likes}
                      onLikeChanged={refreshPosts}
                    />
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleComments(post.id)}
                      className="gap-1"
                    >
                      <MessageCircle className="h-4 w-4" />
                      {post._count.comments > 0 && <span>{post._count.comments}</span>}
                      Commentaires
                    </Button>
                    
                    <PostReport 
                      postId={post.id} 
                      onPostDeleted={() => handlePostDeleted(post.id)} 
                    />
                  </div>
                </div>
                
                {expandedComments.has(post.id) && (
                  <CommentsList
                    postId={post.id}
                    postUserId={post.user.id}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}