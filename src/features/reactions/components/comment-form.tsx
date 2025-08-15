"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { createComment } from "@/features/reactions/actions/create-comment.action";
import { useSession } from "@/lib/auth/auth-client";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface CommentFormProps {
  postId: string;
  parentId?: string;
  onCommentCreated?: () => void;
  onCancel?: () => void;
  placeholder?: string;
  className?: string;
}

export function CommentForm({
  postId,
  parentId,
  onCommentCreated,
  onCancel,
  placeholder = "Écrivez votre commentaire...",
  className = "",
}: CommentFormProps) {
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [authorName, setAuthorName] = useState("");
  const { data: session } = useSession();

  // For non-authenticated users, always treat as anonymous
  const effectiveIsAnonymous = !session || isAnonymous;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    startTransition(async () => {
      try {
        await createComment(postId, content, parentId, effectiveIsAnonymous, authorName);
        setContent("");
        setAuthorName("");
        onCommentCreated?.();
        toast.success("Commentaire ajouté !");
      } catch (error) {
        toast.error("Erreur lors de l'ajout du commentaire");
        console.error(error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        className="min-h-[80px] resize-none"
        required
        disabled={isPending}
      />
      
      {!session && (
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">
            Vous commentez en anonyme.
          </div>
          <Input
            type="text"
            placeholder="Nom (optionnel)"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            disabled={isPending}
          />
        </div>
      )}
      
      {session && (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Switch
              id="anonymous-comment"
              checked={isAnonymous}
              onCheckedChange={setIsAnonymous}
            />
            <Label htmlFor="anonymous-comment" className="text-sm">
              Commenter en anonyme
            </Label>
          </div>
          
          {isAnonymous && (
            <Input
              type="text"
              placeholder="Nom (optionnel)"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              disabled={isPending}
            />
          )}
        </div>
      )}
      
      <div className="flex gap-2">
        <Button type="submit" disabled={isPending || !content.trim()} size="sm">
          {isPending ? "Publier..." : "Publier"}
        </Button>
        
        {onCancel && (
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>
            Annuler
          </Button>
        )}
      </div>
    </form>
  );
}