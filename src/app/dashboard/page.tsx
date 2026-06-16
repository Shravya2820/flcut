import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createLink } from "@/app/actions/link-actions";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    redirect("/");
  }

  const links = await prisma.link.findMany({
    where: {
      creatorId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">
        FLCut Dashboard
      </h1>

      <p className="mb-8">
        Welcome {session.user.name}
      </p>

      <form
        action={createLink}
        className="space-y-4 border p-4 rounded mb-8"
      >
        <h2 className="text-xl font-semibold">
          Create Link
        </h2>

        <input
          name="title"
          placeholder="Link title"
          required
          className="border p-2 w-full"
        />

        <input
          name="originalUrl"
          placeholder="Destination URL"
          required
          className="border p-2 w-full"
        />

        <input
          name="customAlias"
          placeholder="Custom alias (optional)"
          className="border p-2 w-full"
        />
        <input
  type="datetime-local"
  name="startsAt"
  className="border p-2 w-full"
/>

<input
  type="datetime-local"
  name="expiresAt"
  className="border p-2 w-full"
/>

<input
  type="number"
  name="maxClicks"
  placeholder="Max Clicks"
  className="border p-2 w-full"
/>

<input
  name="alternateUrl"
  placeholder="Waitlist URL"
  className="border p-2 w-full"
/>

        <button
          type="submit"
          className="border px-4 py-2"
        >
          Create Link
        </button>
      </form>

      <div>
        <h2 className="text-xl font-semibold mb-4">
          My Links
        </h2>

        <div className="space-y-3">
          {links.map((link) => (
            <div
              key={link.id}
              className="border p-4 rounded"
            >
              <p className="font-medium">
                {link.title}
              </p>

              <p>
                /{link.slug}
              </p>

              <p>
                Clicks: {link.totalClicks}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}