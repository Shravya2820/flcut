import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        FLCut Dashboard
      </h1>

      <div className="space-y-2">
        <p>
          <strong>Name:</strong>{" "}
          {session.user.name}
        </p>

        <p>
          <strong>Email:</strong>{" "}
          {session.user.email}
        </p>

        <p>
          <strong>Role:</strong>{" "}
          {session.user.role}
        </p>

        <p>
          <strong>Position:</strong>{" "}
          {session.user.position}
        </p>
      </div>
    </main>
  );
}