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
  if (link.expiresAt && new Date(link.expiresAt) < now) return "EXPIRED";
  if (link.startsAt && new Date(link.startsAt) > now) return "SCHEDULED";
  if (link.maxClicks && link.totalClicks >= link.maxClicks) return "LIMIT_REACHED";
  return "ACTIVE";
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/");

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) redirect("/");

  const links = await prisma.link.findMany({
    where: { creatorId: user.id },
    orderBy: { createdAt: "desc" },
  });

  const totalClicks = links.reduce((sum, link) => sum + link.totalClicks, 0);
  const activeLinks = links.filter((link) => getStatusType(link) === "ACTIVE").length;

  return (
    <div>
      <PageHeader title="Dashboard" description="Manage and track your shortened links" />

      <div style={{ padding: "28px 28px" }}>
        <div style={{ maxWidth: "1200px" }}>

          {/* Metrics */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", marginBottom: "28px" }}>
            <DashboardMetric label="Total Links" value={links.length} />
            <DashboardMetric label="Total Clicks" value={totalClicks} />
            <DashboardMetric label="Active Links" value={activeLinks} />
            <DashboardMetric label="Role" value={user.systemRole} />
          </div>

          {/* Create Link */}
          <div className="card" style={{ marginBottom: "28px", padding: "24px" }}>
            <h2 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "20px" }}>Create new link</h2>
            <form action={createLink} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "5px", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Title <span style={{ color: "var(--accent-coral)" }}>*</span>
                  </label>
                  <input type="text" name="title" placeholder="e.g. Hackfest Registration" required />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "5px", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Destination URL <span style={{ color: "var(--accent-coral)" }}>*</span>
                  </label>
                  <input type="url" name="originalUrl" placeholder="https://example.com" required />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "5px", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Custom Alias
                  </label>
                  <input type="text" name="customAlias" placeholder="e.g. hackfest26" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "5px", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Max Clicks
                  </label>
                  <input type="number" name="maxClicks" placeholder="Unlimited" min="1" />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "5px", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Starts At
                  </label>
                  <input type="datetime-local" name="startsAt" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "5px", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Expires At
                  </label>
                  <input type="datetime-local" name="expiresAt" />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "5px", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Waitlist URL
                </label>
                <input type="url" name="alternateUrl" placeholder="https://waitlist.example.com" />
              </div>

              <div>
                <button type="submit" className="btn-primary" style={{ padding: "9px 20px" }}>
                  Create link
                </button>
              </div>
            </form>
          </div>

          {/* Links Table */}
          <div>
            <h2 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "14px" }}>Your links</h2>
            {links.length === 0 ? (
              <div className="card">
                <EmptyState title="No links yet" description="Create your first shortened link to get started" />
              </div>
            ) : (
              <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Short link</th>
                        <th>Status</th>
                        <th>Clicks</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {links.map((link) => {
                        const status = getStatusType(link);
                        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
                        const fullUrl = `${baseUrl}/${link.slug}`;
                        return (
                          <tr key={link.id}>
                            <td style={{ fontWeight: 500 }}>{link.title}</td>
                            <td>
                              <code style={{ backgroundColor: "var(--bg-primary)", padding: "3px 7px", borderRadius: "4px", fontSize: "12px", fontFamily: "monospace", color: "var(--text-primary)" }}>
                                /{link.slug}
                              </code>
                            </td>
                            <td><StatusBadge status={status} /></td>
                            <td style={{ fontWeight: 500 }}>{link.totalClicks}</td>
                            <td style={{ color: "var(--text-secondary)", fontSize: "13px" }}>
                              {new Date(link.createdAt).toLocaleDateString()}
                            </td>
                            <td>
                              <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                                <CopyButton text={fullUrl} label="Copy" />
                                <a href={`/dashboard/edit/${link.id}`} style={{ display: "inline-block", backgroundColor: "transparent", border: "1px solid var(--border-default)", borderRadius: "6px", padding: "6px 12px", fontSize: "13px", fontWeight: 500, color: "var(--text-secondary)", textDecoration: "none", transition: "all 0.15s ease" }}>
                                  Edit
                                </a>
                                <DeleteLinkForm linkId={link.id} />
                              </div>
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