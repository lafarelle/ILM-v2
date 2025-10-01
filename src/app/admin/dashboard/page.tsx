import {
  DeleteUserButton,
  PlaceholderDeleteUserButton,
} from "@/components/auth-management/delete-user-button";
import { ReturnButton } from "@/components/buttons/return-button";
import { UserRoleSelect } from "@/components/user-role/user-role-select";
import { CreateForumForm } from "@/features/forums/components/create-forum-form";
import { ForumsList } from "@/features/forums/components/forums-list";
import { getForums } from "@/features/forums/queries/get-forums.action";
import type { UserRole } from "@/generated/prisma";
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

          <h1 className="text-3xl font-bold">Admin Dashboard</h1>

          <div className="space-y-4">
            <p className="p-2 rounded-md text-lg bg-red-600 text-white font-bold">
              ACCESS FORBIDDEN
            </p>

            <div className="p-4 rounded-md bg-yellow-100 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700">
              <h2 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                Debug Information:
              </h2>
              <div className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                <p>
                  <strong>User ID:</strong> {session.user.id}
                </p>
                <p>
                  <strong>User Email:</strong> {session.user.email}
                </p>
                <p>
                  <strong>Current Role:</strong>{" "}
                  {session.user.role || "undefined"}
                </p>
                <p>
                  <strong>Expected Role:</strong> ADMIN
                </p>
                <p>
                  <strong>Session Valid:</strong> {session ? "Yes" : "No"}
                </p>
              </div>
              <div className="mt-3 text-xs text-yellow-600 dark:text-yellow-400">
                <p>If your account should have admin access, check:</p>
                <ul className="list-disc list-inside ml-2 mt-1">
                  <li>
                    Your email is listed in the ADMIN_EMAILS environment
                    variable
                  </li>
                  <li>The database user record has role=ADMIN</li>
                  <li>Try logging out and back in to refresh your session</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { users } = await auth.api.listUsers({
    headers: headersList,
    query: {
      sortBy: "name",
    },
  });

  const sortedUsers = users.sort((a, b) => {
    if (a.role === "ADMIN" && b.role !== "ADMIN") return -1;
    if (a.role !== "ADMIN" && b.role === "ADMIN") return 1;
    return 0;
  });

  const forums = await getForums();

  return (
    <div className="px-8 py-16 container mx-auto max-w-screen-lg space-y-8">
      <div className="space-y-4">
        <ReturnButton href="/" label="Home" />

        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <a href="/admin/manage-shop" className="text-sm underline">
            Gérer la boutique
          </a>
        </div>

        <p className="p-2 rounded-md text-lg bg-green-600 text-white font-bold">
          ACCESS GRANTED
        </p>
      </div>

      <div className="space-y-8">
        {/* Forums Management Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Gestion des Forums</h2>
            <CreateForumForm />
          </div>
          <ForumsList forums={forums} />
        </div>

        {/* Users Management Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Gestion des Utilisateurs</h2>
          <div className="w-full overflow-x-auto">
            <table className="table-auto min-w-full whitespace-nowrap">
              <thead>
                <tr className="border-b text-sm text-left">
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2 text-center">Role</th>
                  <th className="px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {sortedUsers.map((user) => (
                  <tr key={user.id} className="border-b text-sm text-left">
                    <td className="px-4 py-2">{user.id.slice(0, 8)}</td>
                    <td className="px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2 text-center">
                      <UserRoleSelect
                        userId={user.id}
                        role={user.role as UserRole}
                      />
                    </td>
                    <td className="px-4 py-2 text-center">
                      {user.role === "USER" ? (
                        <DeleteUserButton userId={user.id} />
                      ) : (
                        <PlaceholderDeleteUserButton />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
