"use client";

import { useEffect, useState, useCallback } from "react";
import { getComments } from "@/features/reactions/queries/get-comments.action";
import { Comment } from "./comment";
import { CommentForm } from "./comment-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CommentUser {
  name: string;
  image: string | null;
}

interface CommentLike {
  userId: string;
}

interface CommentData {
  id: string;
  content: string;
  createdAt: Date;
  isAnonymous: boolean;
  authorName: string | null;
  userId: string | null;
  user: CommentUser | null;
  likes: CommentLike[];
  replies?: CommentData[];
  postId: string;
}

interface CommentsListProps {
  postId: string;
  postUserId: string;
  className?: string;
}

export function CommentsList({
  postId,
  postUserId,
  className = "",
}: CommentsListProps) {
  const [comments, setComments] = useState<CommentData[]>([]);
  const [loading, setLoading] = useState(true);

  const loadComments = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getComments(postId);
      setComments(data);
    } catch (error) {
      console.error("Erreur lors du chargement des commentaires:", error);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    loadComments();
  }, [postId, loadComments]);

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <div className="text-sm text-muted-foreground">
            Chargement des commentaires...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">
          Commentaires ({comments.length})
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <CommentForm
          postId={postId}
          onCommentCreated={loadComments}
          placeholder="Ajoutez un commentaire..."
        />
        
        {comments.length === 0 ? (
          <div className="text-sm text-muted-foreground text-center py-4">
            Aucun commentaire pour le moment.
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <Comment
                key={comment.id}
                comment={comment}
                postUserId={postUserId}
                onCommentUpdated={loadComments}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}