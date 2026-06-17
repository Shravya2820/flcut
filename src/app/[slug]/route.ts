import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

function htmlPage(title: string, message: string) {
  return new Response(
    `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} — FLCut</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: #F7F7F7;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .card {
      background: #fff;
      border: 1px solid #EAEAEA;
      border-radius: 10px;
      padding: 40px 32px;
      max-width: 380px;
      width: 100%;
      text-align: center;
    }
    .icon {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      border: 1px solid #EAEAEA;
      background: #F7F7F7;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
    }
    h1 { font-size: 20px; font-weight: 700; color: #2C2B30; margin-bottom: 10px; }
    p { font-size: 14px; color: #4F4F51; line-height: 1.6; }
    .brand { font-size: 12px; color: #bbb; margin-top: 24px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4F4F51" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    </div>
    <h1>${title}</h1>
    <p>${message}</p>
    <p class="brand">FLCut · Finite Loop Club</p>
  </div>
</body>
</html>`,
    { status: 200, headers: { "Content-Type": "text/html" } }
  );
}

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;

  const link = await prisma.link.findUnique({ where: { slug } });

  if (!link) {
    return htmlPage("Link not found", "This link does not exist or may have been removed.");
  }

  const now = new Date();

  if (link.startsAt && now < link.startsAt) {
    const opens = new Date(link.startsAt).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
    return htmlPage("Not open yet", `This link will be active on ${opens}.`);
  }

  if (link.expiresAt && now > link.expiresAt) {
    return htmlPage("Link expired", "This event or registration has closed.");
  }

  if (link.maxClicks && link.totalClicks >= link.maxClicks) {
    if (link.alternateUrl) redirect(link.alternateUrl);
    return htmlPage("Limit reached", "All spots have been filled. Check with the organizers for more information.");
  }

  await prisma.link.update({
    where: { id: link.id },
    data: { totalClicks: { increment: 1 } },
  });

  redirect(link.originalUrl);
}