"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { generateSlug } from "@/lib/slug";
import { revalidatePath } from "next/cache";
import { parseISTDateTime } from "@/lib/datetime";

function parseNumber(value: string | null): number | null {
  if (!value || value.trim() === "") return null;
  const n = Number(value);
  return isNaN(n) ? null : n;
}

export async function createLink(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Unauthorized");

  const creator = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!creator) throw new Error("User not found");

  const title = formData.get("title") as string;
  const originalUrl = formData.get("originalUrl") as string;
  const customAlias = (formData.get("customAlias") as string)?.trim();

  // Use the new IST utility to parse dates
  const startsAt = parseISTDateTime(formData.get("startsAt") as string);
  const expiresAt = parseISTDateTime(formData.get("expiresAt") as string);
  
  const maxClicks = parseNumber(formData.get("maxClicks") as string);
  const alternateUrlRaw = (formData.get("alternateUrl") as string)?.trim();
  const alternateUrl = alternateUrlRaw || null;

  const slug = customAlias || generateSlug();

  const existing = await prisma.link.findUnique({ where: { slug } });
  if (existing) throw new Error("Alias already taken. Choose another alias.");

  await prisma.link.create({
    data: {
      title,
      originalUrl,
      slug,
      startsAt,
      expiresAt,
      maxClicks,
      alternateUrl,
      creatorId: creator.id,
    },
  });

  revalidatePath("/dashboard");
}