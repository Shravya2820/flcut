"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth();

  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user || user.systemRole !== "ADMIN") {
    throw new Error("Forbidden");
  }

  return user;
}

export async function toggleUserAuthorization(
  userId: string,
  authorized: boolean
) {
  await requireAdmin();

  await prisma.user.update({
    where: { id: userId },
    data: { isAuthorized: authorized },
  });

  revalidatePath("/dashboard/admin");
}