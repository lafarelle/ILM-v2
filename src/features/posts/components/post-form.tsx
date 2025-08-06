"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { createPost } from "@/features/posts/actions/create-post.action";
import { useState, useTransition } from "react";
import { toast } from "sonner";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    startTransition(async () => {
      try {
        await createPost(content, forumId);
        setContent("");
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
