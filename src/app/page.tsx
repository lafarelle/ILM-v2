import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { auth } from "@/lib/auth/auth";
import { canUserCreatePost } from "@/lib/permissions";
import { headers } from "next/headers";
import Link from "next/link";
import { getPosts } from "@/actions/posts/get-posts.action";
import { createPost } from "@/actions/posts/create-post.action";

async function PostForm() {
  async function handleCreatePost(formData: FormData) {
    "use server";
    const content = formData.get("content") as string;
    if (content?.trim()) {
      await createPost(content);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a Post</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleCreatePost} className="space-y-4">
          <Textarea
            name="content"
            placeholder="What's on your mind?"
            className="min-h-[100px]"
            required
          />
          <Button type="submit">Post</Button>
        </form>
      </CardContent>
    </Card>
  );
}

async function PostsList() {
  const posts = await getPosts();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Posts</CardTitle>
      </CardHeader>
      <CardContent>
        {posts.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No posts yet. Be the first to create one!
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="border rounded-lg p-4">
                <div className="mb-2">
                  <span className="font-medium">{post.user.name}</span>
                  <span className="text-sm text-muted-foreground ml-2">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="whitespace-pre-wrap">{post.content}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default async function Page() {
  const headersList = await headers();
  
  const session = await auth.api.getSession({
    headers: headersList,
  });


  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold tracking-tight">ILoveMeudon Forum</h1>
          <div className="flex items-center gap-2">
            {session ? (
              <>
                <Button size="sm" asChild variant="outline">
                  <Link href="/profile">Profile</Link>
                </Button>
                {session.user.role === "ADMIN" && (
                  <Button size="sm" asChild>
                    <Link href="/admin/dashboard">Admin Dashboard</Link>
                  </Button>
                )}
              </>
            ) : (
              <div className="flex gap-2">
                <Button size="sm" asChild variant="outline">
                  <Link href="/auth/login">Login</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/auth/register">Register</Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {session && (
          <div className="flex items-center justify-between bg-muted/50 p-4 rounded-lg">
            <div>
              <p className="font-medium">Welcome back, {session.user.name}!</p>
              <p className="text-sm text-muted-foreground">
                You can create posts and join the discussion
              </p>
            </div>
          </div>
        )}

        {!session && (
          <Card>
            <CardHeader>
              <CardTitle>Join the Community</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Sign up to create posts and join the ILoveMeudon forum discussion.
              </p>
              <div className="flex gap-2">
                <Button asChild>
                  <Link href="/auth/register">Get Started</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/auth/login">Already have an account?</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {canUserCreatePost() && <PostForm />}

        <PostsList />
      </div>
    </div>
  );
}