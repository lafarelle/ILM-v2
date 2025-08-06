import { HeroSection } from "@/components/landing/hero-section";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { PostForm } from "@/features/posts/components/post-form";
import { PostsList } from "@/features/posts/components/posts-list";


export default async function Page() {
  const headersList = await headers();

  const session = await auth.api.getSession({
    headers: headersList,
  });

  return (
    <div>
      <HeroSection />
      
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="space-y-6">
          {session && (
            <div className="flex items-center justify-between">
              <h1 className="text-4xl font-bold tracking-tight">
                ILoveMeudon Forum
              </h1>
              <div className="flex items-center gap-2">
                <Button size="sm" asChild variant="outline">
                  <Link href="/profile">Profile</Link>
                </Button>
                {session.user.role === "ADMIN" && (
                  <Button size="sm" asChild>
                    <Link href="/admin/dashboard">Admin Dashboard</Link>
                  </Button>
                )}
              </div>
            </div>
          )}

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

          {session && <PostForm />}

          <PostsList />
        </div>
      </div>
    </div>
  );
}
