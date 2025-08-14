"use client";

import { Button } from "@/components/ui/button";
import { voteComment } from "@/features/reactions/actions/vote-comment.action";
import { useSession } from "@/lib/auth/auth-client";
import { useTransition } from "react";
import { toast } from "sonner";
import { ChevronUp, ChevronDown } from "lucide-react";

interface Vote {
  isUpvote: boolean;
  userId: string;
}

interface VoteButtonsProps {
  commentId: string;
  votes: Vote[];
  onVoteChanged?: () => void;
  className?: string;
}

export function VoteButtons({
  commentId,
  votes,
  onVoteChanged,
  className = "",
}: VoteButtonsProps) {
  const [isPending, startTransition] = useTransition();
  const { data: session } = useSession();

  const upvotes = votes.filter(vote => vote.isUpvote).length;
  const downvotes = votes.filter(vote => !vote.isUpvote).length;
  const score = upvotes - downvotes;
  
  const userVote = session?.user?.id 
    ? votes.find(vote => vote.userId === session.user.id)
    : null;

  const handleVote = (isUpvote: boolean) => {
    if (!session?.user?.id) {
      toast.error("Vous devez être connecté pour voter");
      return;
    }

    startTransition(async () => {
      try {
        await voteComment(commentId, isUpvote);
        onVoteChanged?.();
      } catch (error) {
        toast.error("Erreur lors du vote");
        console.error(error);
      }
    });
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <Button
        size="sm"
        variant={userVote?.isUpvote ? "default" : "outline"}
        onClick={() => handleVote(true)}
        disabled={isPending}
        className="h-6 w-6 p-0"
      >
        <ChevronUp className="h-3 w-3" />
      </Button>
      
      <span className="text-xs font-medium min-w-[20px] text-center">
        {score}
      </span>
      
      <Button
        size="sm"
        variant={userVote && !userVote.isUpvote ? "default" : "outline"}
        onClick={() => handleVote(false)}
        disabled={isPending}
        className="h-6 w-6 p-0"
      >
        <ChevronDown className="h-3 w-3" />
      </Button>
    </div>
  );
}