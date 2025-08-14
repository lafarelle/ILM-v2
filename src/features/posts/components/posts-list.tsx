import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPosts } from "@/features/posts/queries/get-posts.action";
import { PostReport } from "./post-report";

export async function PostsList() {
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
              <div key={post.id} className="border rounded-lg p-4 relative">
                <div className="mb-2">
                  <span className="font-medium">{post.user.name}</span>
                  <span className="text-sm text-muted-foreground ml-2">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="whitespace-pre-wrap">{post.content}</p>
                <PostReport postId={post.id} />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}