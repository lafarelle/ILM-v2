"use client";

import { Button } from "@/components/ui/button";
import { toggleCommentLike } from "@/features/reactions/actions/toggle-comment-like.action";
import { useSession } from "@/lib/auth/auth-client";
import { Heart } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface CommentLike {
  userId: string;
}

interface CommentLikeButtonProps {
  commentId: string;
  likes: CommentLike[];
  className?: string;
}

export function CommentLikeButton({
  commentId,
  likes: initialLikes,
  className = "",
}: CommentLikeButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [likes, setLikes] = useState(initialLikes);
  const { data: session } = useSession();

  const likesCount = likes.length;
  const isLiked = session?.user?.id
    ? likes.some((like) => like.userId === session.user.id)
    : false;

  const handleToggleLike = () => {
    if (!session?.user?.id) {
      toast.error("Vous devez être connecté pour aimer");
      return;
    }

    // Optimistic update
    if (isLiked) {
      setLikes(likes.filter((like) => like.userId !== session.user.id));
    } else {
      setLikes([...likes, { userId: session.user.id }]);
    }

    startTransition(async () => {
      try {
        const result = await toggleCommentLike(commentId);
        // If the server response doesn't match our optimistic update, fix it
        if (
          result.liked &&
          !likes.some((like) => like.userId === session.user.id)
        ) {
          setLikes([...likes, { userId: session.user.id }]);
        } else if (
          !result.liked &&
          likes.some((like) => like.userId === session.user.id)
        ) {
          setLikes(likes.filter((like) => like.userId !== session.user.id));
        }
      } catch (error) {
        // Revert optimistic update on error
        setLikes(initialLikes);
        toast.error("Erreur lors de l'action");
        console.error(error);
      }
    });
  };

  return (
    <Button
      size="sm"
      variant={isLiked ? "default" : "outline"}
      onClick={handleToggleLike}
      disabled={isPending}
      className={`gap-1 h-6 ${className}`}
    >
      <Heart className={`h-3 w-3 ${isLiked ? "fill-current" : ""}`} />
      {likesCount > 0 && <span className="text-xs">{likesCount}</span>}
    </Button>
  );
}
