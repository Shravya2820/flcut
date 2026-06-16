"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function getCurrentUser() {
  const session = await auth();

  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

async function canManageLink(
  linkId: string
) {
  const user = await getCurrentUser();

  const link = await prisma.link.findUnique({
    where: {
      id: linkId,
    },
  });

  if (!link) {
    throw new Error("Link not found");
  }

  const elevated =
    user.systemRole === "MANAGER" ||
    user.systemRole === "ADMIN";

  const owner =
    link.creatorId === user.id;

  if (!elevated && !owner) {
    throw new Error("Forbidden");
  }

  return link;
}

export async function deleteLink(
  linkId: string
) {
  await canManageLink(linkId);

  await prisma.link.delete({
    where: {
      id: linkId,
    },
  });

  revalidatePath("/dashboard");
}