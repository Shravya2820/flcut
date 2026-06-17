"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

function parseDate(value: string | null): Date | null {
  if (!value || value.trim() === "") return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

function parseNumber(value: string | null): number | null {
  if (!value || value.trim() === "") return null;
  const n = Number(value);
  return isNaN(n) ? null : n;
}

export async function updateLink(linkId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) throw new Error("User not found");

  const link = await prisma.link.findUnique({ where: { id: linkId } });
  if (!link) throw new Error("Link not found");

  const elevated = user.systemRole === "MANAGER" || user.systemRole === "ADMIN";
  const owner = link.creatorId === user.id;
  if (!elevated && !owner) throw new Error("Forbidden");

  const title = formData.get("title") as string;
  const originalUrl = formData.get("originalUrl") as string;
  const startsAt = parseDate(formData.get("startsAt") as string);
  const expiresAt = parseDate(formData.get("expiresAt") as string);
  const maxClicks = parseNumber(formData.get("maxClicks") as string);
  const alternateUrlRaw = (formData.get("alternateUrl") as string)?.trim();
  const alternateUrl = alternateUrlRaw || null;

  await prisma.link.update({
    where: { id: linkId },
    data: {
      title,
      originalUrl,
      startsAt,
      expiresAt,
      maxClicks,
      alternateUrl,
    },
  });

  revalidatePath("/dashboard");
}