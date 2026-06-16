import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

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

      <p>
        Editing:
        {" "}
        {link.title}
      </p>

      <p className="mt-4">
        Update form coming next.
      </p>
    </main>
  );
}