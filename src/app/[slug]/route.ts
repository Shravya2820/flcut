import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function GET(
  request: Request,
  context: {
    params: Promise<{
      slug: string;
    }>;
  }
) {
  const { slug } = await context.params;

  const link = await prisma.link.findUnique({
    where: {
      slug,
    },
  });

  if (!link) {
    return new Response(
      "Link not found",
      {
        status: 404,
      }
    );
  }

  const now = new Date();

  if (
    link.startsAt &&
    now < link.startsAt
  ) {
    return new Response(
      `Registration opens on ${link.startsAt}`,
      {
        status: 403,
      }
    );
  }

  if (
    link.expiresAt &&
    now > link.expiresAt
  ) {
    return new Response(
      "This event is closed.",
      {
        status: 410,
      }
    );
  }

  if (
    link.maxClicks &&
    link.totalClicks >= link.maxClicks
  ) {
    if (link.alternateUrl) {
      redirect(link.alternateUrl);
    }

    return new Response(
      "Registration limit reached.",
      {
        status: 410,
      }
    );
  }

  await prisma.link.update({
    where: {
      id: link.id,
    },
    data: {
      totalClicks: {
        increment: 1,
      },
    },
  });

  redirect(link.originalUrl);
}