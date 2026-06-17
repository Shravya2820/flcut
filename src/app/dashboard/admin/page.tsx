import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { toggleUserAuthorization } from "@/app/actions/admin-actions";
import PageHeader from "@/app/components/PageHeader";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/");

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  // Guard: Render feedback state UI instead of a silent redirect bounce
  if (!currentUser || currentUser.systemRole !== "ADMIN") {
    return (
      <div>
        <PageHeader title="Access Denied" description="Admin Clearance Required" />
        <div style={{ padding: "28px" }}>
          <div className="card" style={{ padding: "32px", maxWidth: "600px", textAlign: "center", margin: "40px auto" }}>
            <div style={{ display: "inline-flex", padding: "12px", borderRadius: "50%", backgroundColor: "rgba(244,67,54,0.08)", marginBottom: "16px" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C62828" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
              </svg>
            </div>
            <h2 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px", color: "var(--text-primary)" }}>
              Admins Only
            </h2>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.5", marginBottom: "0" }}>
              Your account current possesses <strong>{currentUser?.systemRole || "USER"}</strong> status privileges. 
              You need full Admin clearance levels to view or modify member records on this page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const users = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div>
      <PageHeader title="Admin" description="Manage FLC member access and roles" />

      <div style={{ padding: "28px" }}>
        <div style={{ maxWidth: "1000px" }}>
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Position</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td style={{ fontWeight: 500 }}>{user.name}</td>
                      <td style={{ color: "var(--text-secondary)", fontSize: "13px" }}>{user.email}</td>
                      <td style={{ fontSize: "13px" }}>{user.flcPosition.replace(/_/g, " ")}</td>
                      <td>
                        <span style={{ display: "inline-block", fontSize: "11px", fontWeight: 600, padding: "2px 8px", borderRadius: "4px", backgroundColor: "rgba(245,143,124,0.1)", color: "var(--accent-coral)" }}>
                          {user.systemRole}
                        </span>
                      </td>
                      <td>
                        <span style={{ display: "inline-block", fontSize: "11px", fontWeight: 600, padding: "2px 8px", borderRadius: "4px", backgroundColor: user.isAuthorized ? "rgba(76,175,80,0.1)" : "rgba(244,67,54,0.08)", color: user.isAuthorized ? "#2E7D32" : "#C62828" }}>
                          {user.isAuthorized ? "Active" : "Disabled"}
                        </span>
                      </td>
                      <td>
                        <form action={toggleUserAuthorization.bind(null, user.id, !user.isAuthorized)}>
                          <button
                            type="submit"
                            style={{
                              backgroundColor: "transparent",
                              border: `1px solid ${user.isAuthorized ? "#fecaca" : "#bbf7d0"}`,
                              borderRadius: "6px",
                              padding: "5px 12px",
                              fontSize: "12px",
                              fontWeight: 500,
                              color: user.isAuthorized ? "#C62828" : "#15803d",
                              cursor: "pointer",
                            }}
                          >
                            {user.isAuthorized ? "Disable" : "Enable"}
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}