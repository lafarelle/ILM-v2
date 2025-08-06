import { HeroSection } from "@/components/landing/hero-section";
import { PostsList } from "@/features/posts/components/posts-list";
// import { auth } from "@/lib/auth/auth";
// import { headers } from "next/headers";

export default async function Page() {
  // const headersList = await headers();

  // const session = await auth.api.getSession({
  //   headers: headersList,
  // });

  return (
    <div>
      <HeroSection />

      <div className="container mx-auto max-w-7xl px-4 ">
        <PostsList />
      </div>
    </div>
  );
}
