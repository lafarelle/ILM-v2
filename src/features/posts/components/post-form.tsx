"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MentionInput } from "@/components/mention-input";
import { createPost } from "@/features/posts/actions/create-post.action";
import { useSession } from "@/lib/auth/auth-client";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { PostsContext } from "@/features/posts/context/posts-context";
import { ForumPostsContext } from "@/features/posts/context/forum-posts-context";
import { useContext } from "react";
import { useFileUpload } from "@/hooks/use-file-upload";
import { ImageIcon, X } from "lucide-react";
import type { PostFormProps } from "@/features/posts/schemas";

export function PostForm({
  showCard = true,
  placeholder = "What's on your mind?",
  className = "",
  forumId,
}: PostFormProps) {
  const [content, setContent] = useState("");
  const [mentions, setMentions] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [authorName, setAuthorName] = useState("");
  const { data: session } = useSession();
  const postsContext = useContext(PostsContext);
  const forumPostsContext = useContext(ForumPostsContext);
  
  // Use forum context if available (forum page), otherwise use general posts context
  const refreshPosts = forumPostsContext?.refreshPosts || postsContext?.refreshPosts;

  // File upload hook for images
  const [fileUploadState, fileUploadActions] = useFileUpload({
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
    accept: "image/*",
    multiple: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    // For non-logged users, force anonymous posting
    const shouldBeAnonymous = !session || isAnonymous;

    startTransition(async () => {
      try {
        // Get the uploaded file if any
        const imageFile = fileUploadState.files.length > 0 && fileUploadState.files[0].file instanceof File 
          ? fileUploadState.files[0].file 
          : undefined;

        await createPost(content, forumId, shouldBeAnonymous, authorName, imageFile, mentions);
        setContent("");
        setMentions([]);
        setAuthorName("");
        fileUploadActions.clearFiles();
        refreshPosts?.();
        toast.success("Post created successfully!");
      } catch {
        toast.error("Failed to create post");
      }
    });
  };

  const formContent = (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      <MentionInput
        value={content}
        onChange={setContent}
        onMentionsChange={setMentions}
        placeholder={placeholder}
        className="min-h-[100px] resize-none"
      />
      
      {/* Image Upload Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={fileUploadActions.openFileDialog}
            disabled={isPending}
            className="flex items-center gap-2"
          >
            <ImageIcon className="w-4 h-4" />
            Ajouter une image
          </Button>
          {fileUploadState.files.length > 0 && (
            <span className="text-sm text-muted-foreground">
              {fileUploadState.files[0].file.name}
            </span>
          )}
        </div>
        
        {/* Hidden file input */}
        <input {...fileUploadActions.getInputProps()} className="hidden" />
        
        {/* Image preview */}
        {fileUploadState.files.length > 0 && fileUploadState.files[0].preview && (
          <div className="relative inline-block">
            <img
              src={fileUploadState.files[0].preview}
              alt="Preview"
              className="max-w-xs max-h-48 rounded-lg border"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
              onClick={() => fileUploadActions.removeFile(fileUploadState.files[0].id)}
              disabled={isPending}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        )}
        
        {/* Upload errors */}
        {fileUploadState.errors.length > 0 && (
          <div className="text-sm text-red-500">
            {fileUploadState.errors.map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </div>
        )}
      </div>
      
      {!session && (
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">
            Votre message sera publié en anonyme.
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
              id="anonymous-mode"
              checked={isAnonymous}
              onCheckedChange={setIsAnonymous}
            />
            <Label htmlFor="anonymous-mode" className="text-sm">
              Publier en anonyme
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
