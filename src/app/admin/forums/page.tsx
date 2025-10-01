import { ReturnButton } from "@/components/buttons/return-button";
import { CreateForumForm } from "@/features/forums/components/create-forum-form";
import { ForumsList } from "@/features/forums/components/forums-list";
import { getForums } from "@/features/forums/queries/get-forums.action";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
  const headersList = await headers();

  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session) redirect("/auth/login");

  if (session.user.role !== "ADMIN") {
    return (
      <div className="px-8 py-16 container mx-auto max-w-screen-lg space-y-8">
        <div className="space-y-4">
          <ReturnButton href="/" label="Home" />

          <h1 className="text-3xl font-bold">Admin Forums</h1>

          <div className="space-y-4">
            <p className="p-2 rounded-md text-lg bg-red-600 text-white font-bold">
              ACCESS FORBIDDEN
            </p>
          </div>
        </div>
      </div>
    );
  }

  const forums = await getForums();

  return (
    <div className="px-8 py-16 container mx-auto max-w-screen-lg space-y-8">
      <div className="space-y-4">
        <ReturnButton href="/admin/dashboard" label="Admin" />

        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Gestion des Forums</h1>
          <CreateForumForm />
        </div>
      </div>

      <div className="space-y-8">
        <ForumsList forums={forums} />
      </div>
    </div>
  );
}
