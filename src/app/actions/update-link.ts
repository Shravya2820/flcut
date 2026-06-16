"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateLink(
  linkId: string,
  formData: FormData
) {
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

  const title =
    formData.get("title") as string;

  const originalUrl =
    formData.get("originalUrl") as string;

  const startsAt =
    formData.get("startsAt") as string;

  const expiresAt =
    formData.get("expiresAt") as string;

  const maxClicks =
    formData.get("maxClicks") as string;

  const alternateUrl =
    formData.get("alternateUrl") as string;

  await prisma.link.update({
    where: {
      id: linkId,
    },
    data: {
      title,
      originalUrl,

      startsAt: startsAt
        ? new Date(startsAt)
        : null,

      expiresAt: expiresAt
        ? new Date(expiresAt)
        : null,

      maxClicks: maxClicks
        ? Number(maxClicks)
        : null,

      alternateUrl:
        alternateUrl || null,
    },
  });

  revalidatePath("/dashboard");
  redirect("/dashboard");
  }