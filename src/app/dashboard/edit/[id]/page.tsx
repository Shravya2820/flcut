import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { updateLink } from "@/app/actions/update-link";

export default async function EditPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;

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

  if (!currentUser) {
    redirect("/");
  }

  const link =
    await prisma.link.findUnique({
      where: {
        id,
      },
    });

  if (!link) {
    redirect("/dashboard");
  }

  const elevated =
    currentUser.systemRole ===
      "MANAGER" ||
    currentUser.systemRole ===
      "ADMIN";

  const owner =
    link.creatorId === currentUser.id;

  if (!elevated && !owner) {
    redirect("/dashboard");
  }

  return (
    <main className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">
        Edit Link
      </h1>

      <form
        action={updateLink.bind(
          null,
          link.id
        )}
        className="space-y-4 border p-4 rounded"
      >
        <input
          name="title"
          defaultValue={link.title}
          required
          className="border p-2 w-full"
        />

        <input
          name="originalUrl"
          defaultValue={link.originalUrl}
          required
          className="border p-2 w-full"
        />

        <input
          type="datetime-local"
          name="startsAt"
          defaultValue={
            link.startsAt
              ? new Date(
                  link.startsAt
                )
                  .toISOString()
                  .slice(0, 16)
              : ""
          }
          className="border p-2 w-full"
        />

        <input
          type="datetime-local"
          name="expiresAt"
          defaultValue={
            link.expiresAt
              ? new Date(
                  link.expiresAt
                )
                  .toISOString()
                  .slice(0, 16)
              : ""
          }
          className="border p-2 w-full"
        />

        <input
          type="number"
          name="maxClicks"
          defaultValue={
            link.maxClicks ?? ""
          }
          className="border p-2 w-full"
        />

        <input
          name="alternateUrl"
          defaultValue={
            link.alternateUrl ?? ""
          }
          className="border p-2 w-full"
        />

        <button
          type="submit"
          className="border px-4 py-2"
        >
          Save Changes
        </button>
      </form>
    </main>
  );
}