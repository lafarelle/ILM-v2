import { HeroSection } from "@/components/landing/hero-section";
import { PostsList } from "@/features/posts/components/posts-list";
import { PostsProvider } from "@/features/posts/context/posts-context";
import { getForums } from "@/features/forums/queries/get-forums.action";

export default async function Page() {
  const forums = await getForums();

  return (
    <PostsProvider>
      <div>
        <HeroSection forums={forums} />

        <div className="container mx-auto max-w-7xl px-4 ">
          <PostsList />
        </div>
      </div>
    </PostsProvider>
  );
}
