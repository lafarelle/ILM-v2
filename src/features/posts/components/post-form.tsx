"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { createPost } from "@/features/posts/actions/create-post.action";
import { useSession } from "@/lib/auth/auth-client";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { PostsContext } from "@/features/posts/context/posts-context";
import { ForumPostsContext } from "@/features/posts/context/forum-posts-context";
import { useContext } from "react";

interface PostFormProps {
  showCard?: boolean;
  placeholder?: string;
  className?: string;
  forumId?: string;
}

export function PostForm({
  showCard = true,
  placeholder = "What's on your mind?",
  className = "",
  forumId,
}: PostFormProps) {
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isAnonymous, setIsAnonymous] = useState(false);
  const { data: session } = useSession();
  const postsContext = useContext(PostsContext);
  const forumPostsContext = useContext(ForumPostsContext);
  
  // Use forum context if available (forum page), otherwise use general posts context
  const refreshPosts = forumPostsContext?.refreshPosts || postsContext?.refreshPosts;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    startTransition(async () => {
      try {
        await createPost(content, forumId, isAnonymous);
        setContent("");
        refreshPosts?.();
        toast.success("Post created successfully!");
      } catch {
        toast.error("Failed to create post");
      }
    });
  };

  const formContent = (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        className="min-h-[100px] resize-none"
        required
        disabled={isPending}
      />
      
      {!session && (
        <div className="text-sm text-muted-foreground">
          Votre message sera publié en anonyme.
        </div>
      )}
      
      {session && (
        <div className="flex items-center space-x-2">
          <Switch
            id="anonymous-mode"
            checked={isAnonymous}
            onCheckedChange={setIsAnonymous}
          />
          <Label htmlFor="anonymous-mode" className="text-sm">
            Publier en anonyme
          </Label>
        </div>
      )}
      
      <Button type="submit" disabled={isPending || !content.trim()}>
        {isPending ? "Publier..." : "Publier"}
      </Button>
    </form>
  );

  if (!showCard) {
    return formContent;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a Post</CardTitle>
      </CardHeader>
      <CardContent>{formContent}</CardContent>
    </Card>
  );
}
