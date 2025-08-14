"use client";

import { Button } from "@/components/ui/button";
import { togglePostLike } from "@/features/reactions/actions/toggle-post-like.action";
import { useSession } from "@/lib/auth/auth-client";
import { useTransition } from "react";
import { toast } from "sonner";
import { Heart } from "lucide-react";

interface PostLike {
  userId: string;
}

interface PostLikeButtonProps {
  postId: string;
  likes: PostLike[];
  onLikeChanged?: () => void;
  className?: string;
}

export function PostLikeButton({
  postId,
  likes,
  onLikeChanged,
  className = "",
}: PostLikeButtonProps) {
  const [isPending, startTransition] = useTransition();
  const { data: session } = useSession();

  const likesCount = likes.length;
  const isLiked = session?.user?.id 
    ? likes.some(like => like.userId === session.user.id)
    : false;

  const handleToggleLike = () => {
    if (!session?.user?.id) {
      toast.error("Vous devez être connecté pour aimer");
      return;
    }

    startTransition(async () => {
      try {
        await togglePostLike(postId);
        onLikeChanged?.();
      } catch (error) {
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
      className={`gap-1 ${className}`}
    >
      <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
      {likesCount > 0 && <span>{likesCount}</span>}
    </Button>
  );
}