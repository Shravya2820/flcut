"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { generateSlug } from "@/lib/slug";

export async function createLink(
  formData: FormData
) {
  const session = await auth();

  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const creator = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!creator) {
    throw new Error("User not found");
  }

  const title =
    formData.get("title") as string;

  const originalUrl =
    formData.get("originalUrl") as string;

  const customAlias =
    (formData.get("customAlias") as string)?.trim();

  const startsAt =
    formData.get("startsAt") as string;

  const expiresAt =
    formData.get("expiresAt") as string;

  const maxClicks =
    formData.get("maxClicks") as string;

  const alternateUrl =
    formData.get("alternateUrl") as string;

  const slug =
    customAlias || generateSlug();

  const existing =
    await prisma.link.findUnique({
      where: {
        slug,
      },
    });

  if (existing) {
    throw new Error(
      "Alias already taken. Choose another alias."
    );
  }

  await prisma.link.create({
    data: {
      title,
      originalUrl,
      slug,

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

      creatorId: creator.id,
    },
  });
}