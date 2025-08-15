"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForumPostsContext } from "@/features/posts/context/forum-posts-context";
import { usePostsContext } from "@/features/posts/context/posts-context";
import type { SimplePost } from "@/features/posts/schemas";
import { CommentsList } from "@/features/reactions/components/comments-list";
import { PostLikeButton } from "@/features/reactions/components/post-like-button";
import { MessageCircle } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { PostReport } from "./post-report";

interface PostsListProps {
  title?: string;
  forumName?: string;
  emptyMessage?: string;
}

function PostsListContent({
  posts,
  loading,
  handlePostDeleted,
  title = "Recent Posts",
  forumName,
  emptyMessage = "No posts yet. Be the first to create one!",
}: {
  posts: SimplePost[];
  loading: boolean;
  handlePostDeleted: (id: string) => void;
  title?: string;
  forumName?: string;
  emptyMessage?: string;
}) {
  const [expandedComments, setExpandedComments] = useState<Set<string>>(
    new Set()
  );

  const toggleComments = (postId: string) => {
    const newExpandedComments = new Set(expandedComments);
    if (newExpandedComments.has(postId)) {
      newExpandedComments.delete(postId);
    } else {
      newExpandedComments.add(postId);
    }
    setExpandedComments(newExpandedComments);
  };

  const displayTitle = forumName ? `Posts dans ${forumName}` : title;
  const displayEmptyMessage = forumName
    ? "Aucun post dans ce forum. Soyez le premier à créer un post !"
    : emptyMessage;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{displayTitle}</CardTitle>
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
        <CardTitle>{displayTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        {posts.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            {displayEmptyMessage}
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post.id} className="space-y-4">
                <div className="border rounded-lg p-4 relative">
                  <div className="mb-2">
                    <span className="font-medium">
                      {post.isAnonymous
                        ? post.authorName || "Anonyme"
                        : post.user?.name}
                    </span>
                    <span className="text-sm text-muted-foreground ml-2">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap mb-3">{post.content}</p>

                  {/* Display image if available */}
                  {post.imageUrl && (
                    <div className="mb-3">
                      <Image
                        src={post.imageUrl}
                        alt="Post image"
                        width={800}
                        height={400}
                        className="max-w-full h-auto rounded-lg border"
                        style={{ maxHeight: "400px" }}
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <PostLikeButton postId={post.id} likes={post.likes} />

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleComments(post.id)}
                      className="gap-1"
                    >
                      <MessageCircle className="h-4 w-4" />
                      {post._count.comments > 0 && (
                        <span>{post._count.comments}</span>
                      )}
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
                    postUserId={post.user?.id || null}
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

export function PostsList({ title, emptyMessage }: PostsListProps = {}) {
  const { posts, loading, handlePostDeleted } = usePostsContext();

  return (
    <PostsListContent
      posts={posts}
      loading={loading}
      handlePostDeleted={handlePostDeleted}
      title={title}
      emptyMessage={emptyMessage}
    />
  );
}

export function ForumPostsList({ forumName }: { forumName: string }) {
  const { posts, loading, handlePostDeleted } = useForumPostsContext();

  return (
    <PostsListContent
      posts={posts}
      loading={loading}
      handlePostDeleted={handlePostDeleted}
      forumName={forumName}
    />
  );
}
