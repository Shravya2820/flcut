import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { updateLink } from "@/app/actions/update-link";
import PageHeader from "@/app/components/PageHeader";

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

  const currentUser = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!currentUser) {
    redirect("/");
  }

  const link = await prisma.link.findUnique({
    where: {
      id,
    },
  });

  if (!link) {
    redirect("/dashboard");
  }

  const elevated =
    currentUser.systemRole === "MANAGER" || currentUser.systemRole === "ADMIN";

  const owner = link.creatorId === currentUser.id;

  if (!elevated && !owner) {
    redirect("/dashboard");
  }

  return (
    <div>
      {/* Page Header */}
      <PageHeader title="Edit Link" description="Update your link configuration" />

      {/* Main Content */}
      <div style={{ padding: "32px 24px" }}>
        <div style={{ maxWidth: "600px" }}>
          {/* Link Summary Card */}
          <div className="card" style={{ marginBottom: "24px" }}>
            <h3 style={{ marginBottom: "16px", fontSize: "14px", fontWeight: 600, color: "var(--text-secondary)" }}>
              LINK SUMMARY
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px" }}>Short URL</p>
                <code
                  style={{
                    display: "block",
                    backgroundColor: "var(--bg-primary)",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    fontSize: "13px",
                    fontFamily: "monospace",
                    fontWeight: 600,
                    color: "var(--accent-coral)",
                    wordBreak: "break-all",
                  }}
                >
                  /{link.slug}
                </code>
              </div>
              <div>
                <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px" }}>Total Clicks</p>
                <p style={{ fontSize: "24px", fontWeight: 600, color: "var(--text-primary)" }}>
                  {link.totalClicks}
                </p>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <form action={updateLink.bind(null, link.id)} className="card card-lg">
            <h2 style={{ marginBottom: "24px", fontSize: "18px" }}>Edit Details</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Title */}
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px", color: "var(--text-primary)" }}>
                  Title <span style={{ color: "var(--accent-coral)" }}>*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  defaultValue={link.title}
                  required
                  placeholder="Link title"
                />
              </div>

              {/* Original URL */}
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px", color: "var(--text-primary)" }}>
                  Destination URL <span style={{ color: "var(--accent-coral)" }}>*</span>
                </label>
                <input
                  type="url"
                  name="originalUrl"
                  defaultValue={link.originalUrl}
                  required
                  placeholder="https://example.com"
                />
              </div>

              {/* Dates */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px", color: "var(--text-primary)" }}>
                    Starts At
                  </label>
                  <input
                    type="datetime-local"
                    name="startsAt"
                    defaultValue={
                      link.startsAt
                        ? new Date(link.startsAt)
                            .toISOString()
                            .slice(0, 16)
                        : ""
                    }
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px", color: "var(--text-primary)" }}>
                    Expires At
                  </label>
                  <input
                    type="datetime-local"
                    name="expiresAt"
                    defaultValue={
                      link.expiresAt
                        ? new Date(link.expiresAt)
                            .toISOString()
                            .slice(0, 16)
                        : ""
                    }
                  />
                </div>
              </div>

              {/* Max Clicks & Alternate URL */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px", color: "var(--text-primary)" }}>
                    Max Clicks
                  </label>
                  <input
                    type="number"
                    name="maxClicks"
                    defaultValue={link.maxClicks ?? ""}
                    min="1"
                    placeholder="Leave blank for unlimited"
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px", color: "var(--text-primary)" }}>
                    Waitlist URL
                  </label>
                  <input
                    type="url"
                    name="alternateUrl"
                    defaultValue={link.alternateUrl ?? ""}
                    placeholder="https://waitlist.example.com"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div style={{ display: "flex", gap: "12px", paddingTop: "8px", borderTop: "1px solid var(--border-default)" }}>
                <button type="submit" className="btn-primary">
                  Save Changes
                </button>
                <Link href="/dashboard" className="btn-secondary">
                  Cancel
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
