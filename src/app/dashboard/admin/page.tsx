import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { toggleUserAuthorization } from "@/app/actions/admin-actions";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/");
  }

  const currentUser =
    await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

  if (
    !currentUser ||
    currentUser.systemRole !== "ADMIN"
  ) {
    redirect("/dashboard");
  }

  const users =
    await prisma.user.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });

  return (
    <main className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">
        Admin Panel
      </h1>

      <table className="w-full border">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Position</th>
            <th>Role</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>

              <td>{user.email}</td>

              <td>{user.flcPosition}</td>

              <td>{user.systemRole}</td>

              <td>
                {user.isAuthorized
                  ? "Authorized"
                  : "Disabled"}
              </td>

              <td>
                <form
                  action={async () => {
                    "use server";

                    await toggleUserAuthorization(
                      user.id,
                      !user.isAuthorized
                    );
                  }}
                >
                  <button
                    className="border px-2 py-1"
                  >
                    {user.isAuthorized
                      ? "Disable"
                      : "Enable"}
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}