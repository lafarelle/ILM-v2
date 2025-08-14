"use client";

import { Button } from "@/components/ui/button";
import { deleteComment } from "@/features/reactions/actions/delete-comment.action";
import { useSession } from "@/lib/auth/auth-client";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { MessageCircle, Trash2 } from "lucide-react";
import { CommentForm } from "./comment-form";
import { VoteButtons } from "./vote-buttons";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface CommentUser {
  name: string;
  image: string | null;
}

interface CommentVote {
  isUpvote: boolean;
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
  votes: CommentVote[];
  replies?: CommentData[];
  postId: string;
}

interface CommentProps {
  comment: CommentData;
  postUserId: string;
  onCommentUpdated?: () => void;
  className?: string;
  depth?: number;
}

export function Comment({
  comment,
  postUserId,
  onCommentUpdated,
  className = "",
  depth = 0,
}: CommentProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { data: session } = useSession();

  const canDelete = session?.user?.id && (
    comment.userId === session.user.id || 
    postUserId === session.user.id || 
    session.user.role === "ADMIN"
  );

  const handleDelete = () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce commentaire ?")) {
      return;
    }

    startTransition(async () => {
      try {
        await deleteComment(comment.id);
        onCommentUpdated?.();
        toast.success("Commentaire supprimé");
      } catch (error) {
        toast.error("Erreur lors de la suppression");
        console.error(error);
      }
    });
  };

  const displayName = comment.isAnonymous 
    ? (comment.authorName || "Anonyme")
    : comment.user?.name || "Utilisateur";

  const timeAgo = formatDistanceToNow(new Date(comment.createdAt), {
    addSuffix: true,
    locale: fr
  });

  return (
    <div className={`space-y-2 ${className}`} style={{ marginLeft: `${depth * 24}px` }}>
      <div className="border border-border rounded-lg p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{displayName}</span>
            {comment.isAnonymous && (
              <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                anonyme
              </span>
            )}
            <span className="text-xs text-muted-foreground">{timeAgo}</span>
          </div>
          
          {canDelete && (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDelete}
              disabled={isPending}
              className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
        
        <p className="text-sm leading-relaxed">{comment.content}</p>
        
        <div className="flex items-center gap-2">
          <VoteButtons
            commentId={comment.id}
            votes={comment.votes}
            onVoteChanged={onCommentUpdated}
          />
          
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="h-6 gap-1 px-2 text-xs"
          >
            <MessageCircle className="h-3 w-3" />
            Répondre
          </Button>
        </div>
        
        {showReplyForm && (
          <div className="pt-2">
            <CommentForm
              postId={comment.postId}
              parentId={comment.id}
              onCommentCreated={() => {
                setShowReplyForm(false);
                onCommentUpdated?.();
              }}
              onCancel={() => setShowReplyForm(false)}
              placeholder="Écrivez votre réponse..."
              className="text-sm"
            />
          </div>
        )}
      </div>
      
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-2">
          {comment.replies.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              postUserId={postUserId}
              onCommentUpdated={onCommentUpdated}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}