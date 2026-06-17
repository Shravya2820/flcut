import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createLink } from "@/app/actions/link-actions";
import CopyButton from "@/app/components/CopyButton";
import DeleteLinkForm from "@/app/components/DeleteLinkForm";
import PageHeader from "@/app/components/PageHeader";
import DashboardMetric from "@/app/components/DashboardMetric";
import StatusBadge from "@/app/components/StatusBadge";
import EmptyState from "@/app/components/EmptyState";

function getStatusType(link: any): "ACTIVE" | "EXPIRED" | "SCHEDULED" | "LIMIT_REACHED" {
  const now = new Date();

  if (link.expiresAt && new Date(link.expiresAt) < now) {
    return "EXPIRED";
  }

  if (link.startsAt && new Date(link.startsAt) > now) {
    return "SCHEDULED";
  }

  if (link.maxClicks && link.totalClicks >= link.maxClicks) {
    return "LIMIT_REACHED";
  }

  return "ACTIVE";
}

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    redirect("/");
  }

  const links = await prisma.link.findMany({
    where: {
      creatorId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalClicks = links.reduce((sum, link) => sum + link.totalClicks, 0);
  const activeLinks = links.filter((link) => getStatusType(link) === "ACTIVE").length;
  const userRole = user.systemRole || "MEMBER";

  return (
    <div>
      {/* Page Header */}
      <PageHeader title="Dashboard" description="Manage and track your shortened links" />

      {/* Main Content */}
      <div style={{ padding: "32px 24px" }}>
        <div style={{ maxWidth: "1400px" }}>
          {/* Metrics Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "16px",
              marginBottom: "32px",
            }}
          >
            <DashboardMetric label="Total Links" value={links.length} icon="🔗" />
            <DashboardMetric label="Total Clicks" value={totalClicks} icon="📊" />
            <DashboardMetric label="Active Links" value={activeLinks} icon="✨" />
            <DashboardMetric label="Your Role" value={userRole} icon="👤" />
          </div>

          {/* Create Link Section */}
          <div className="card card-lg" style={{ marginBottom: "32px" }}>
            <h2 style={{ marginBottom: "24px", fontSize: "18px" }}>Create New Link</h2>

            <form action={createLink} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Title Row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px", color: "var(--text-primary)" }}>
                    Title <span style={{ color: "var(--accent-coral)" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    placeholder="e.g., Event Registration"
                    required
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px", color: "var(--text-primary)" }}>
                    Destination URL <span style={{ color: "var(--accent-coral)" }}>*</span>
                  </label>
                  <input
                    type="url"
                    name="originalUrl"
                    placeholder="https://example.com"
                    required
                  />
                </div>
              </div>

              {/* Custom Alias & Max Clicks Row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px", color: "var(--text-primary)" }}>
                    Custom Alias
                  </label>
                  <input type="text" name="customAlias" placeholder="Leave blank for auto-generated" />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px", color: "var(--text-primary)" }}>
                    Max Clicks
                  </label>
                  <input type="number" name="maxClicks" placeholder="Leave blank for unlimited" min="1" />
                </div>
              </div>

              {/* Dates Row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px", color: "var(--text-primary)" }}>
                    Starts At
                  </label>
                  <input type="datetime-local" name="startsAt" />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px", color: "var(--text-primary)" }}>
                    Expires At
                  </label>
                  <input type="datetime-local" name="expiresAt" />
                </div>
              </div>

              {/* Alternate URL */}
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px", color: "var(--text-primary)" }}>
                  Waitlist URL (Alternate)
                </label>
                <input type="url" name="alternateUrl" placeholder="https://waitlist.example.com" />
              </div>

              {/* Submit */}
              <button type="submit" className="btn-primary" style={{ alignSelf: "flex-start", padding: "10px 24px" }}>
                Create Link
              </button>
            </form>
          </div>

          {/* Links List Section */}
          <div>
            <h2 style={{ marginBottom: "16px", fontSize: "18px" }}>Your Links</h2>

            {links.length === 0 ? (
              <div className="card">
                <EmptyState
                  icon="🔗"
                  title="No links yet"
                  description="Create your first shortened link to get started"
                />
              </div>
            ) : (
              <div className="card">
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Short Link</th>
                        <th>Status</th>
                        <th>Clicks</th>
                        <th>Created</th>
                        <th style={{ textAlign: "right" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {links.map((link) => {
                        const status = getStatusType(link);
                        const fullUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/${link.slug}`;

                        return (
                          <tr key={link.id}>
                            <td style={{ fontWeight: 500 }}>{link.title}</td>
                            <td>
                              <code
                                style={{
                                  backgroundColor: "var(--bg-primary)",
                                  padding: "4px 8px",
                                  borderRadius: "4px",
                                  fontSize: "12px",
                                  fontFamily: "monospace",
                                  color: "var(--text-primary)",
                                }}
                              >
                                /{link.slug}
                              </code>
                            </td>
                            <td>
                              <StatusBadge status={status} />
                            </td>
                            <td>
                              <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>
                                {link.totalClicks}
                              </span>
                            </td>
                            <td style={{ color: "var(--text-secondary)", fontSize: "13px" }}>
                              {new Date(link.createdAt).toLocaleDateString()}
                            </td>
                            <td
                              style={{
                                textAlign: "right",
                                display: "flex",
                                gap: "8px",
                                justifyContent: "flex-end",
                              }}
                            >
                              <CopyButton text={fullUrl} label="Copy" />
                              <a
                                href={`/dashboard/edit/${link.id}`}
                                className="btn-secondary btn-sm"
                                style={{ textDecoration: "none" }}
                              >
                                Edit
                              </a>
                              <DeleteLinkForm linkId={link.id} />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}