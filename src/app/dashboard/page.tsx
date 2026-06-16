import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createLink } from "@/app/actions/link-actions";
import CopyButton from "@/app/components/CopyButton";
import DeleteLinkForm from "@/app/components/DeleteLinkForm";

function getStatusBadge(link: any): { status: string; color: string } {
  const now = new Date();

  if (link.expiresAt && new Date(link.expiresAt) < now) {
    return { status: "EXPIRED", color: "bg-red-100 text-red-800" };
  }

  if (link.startsAt && new Date(link.startsAt) > now) {
    return { status: "SCHEDULED", color: "bg-yellow-100 text-yellow-800" };
  }

  if (link.maxClicks && link.totalClicks >= link.maxClicks) {
    return { status: "LIMIT REACHED", color: "bg-orange-100 text-orange-800" };
  }

  return { status: "ACTIVE", color: "bg-green-100 text-green-800" };
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
  const userRole = user.systemRole || "MEMBER";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-[#AFDDE5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-[#003135] mb-2">Dashboard</h1>
          <p className="text-gray-600">Manage and monitor all your shortened links</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Links Card */}
          <div className="bg-white rounded-xl shadow-sm border border-[#AFDDE5] p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">Total Links</p>
                <p className="text-4xl font-bold text-[#003135]">{links.length}</p>
              </div>
              <div className="w-12 h-12 bg-[#AFDDE5] rounded-lg flex items-center justify-center text-2xl">
                🔗
              </div>
            </div>
          </div>

          {/* Total Clicks Card */}
          <div className="bg-white rounded-xl shadow-sm border border-[#AFDDE5] p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">Total Clicks</p>
                <p className="text-4xl font-bold text-[#003135]">{totalClicks}</p>
              </div>
              <div className="w-12 h-12 bg-[#0FA4AF] rounded-lg flex items-center justify-center text-2xl">
                📊
              </div>
            </div>
          </div>

          {/* Role Card */}
          <div className="bg-white rounded-xl shadow-sm border border-[#AFDDE5] p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">Your Role</p>
                <p className="text-2xl font-bold text-[#003135]">{userRole}</p>
              </div>
              <div className="w-12 h-12 bg-[#024950] rounded-lg flex items-center justify-center text-2xl">
                👤
              </div>
            </div>
          </div>
        </div>

        {/* Create Link Section */}
        <div className="bg-white rounded-xl shadow-sm border border-[#AFDDE5] p-8 mb-8">
          <h2 className="text-2xl font-bold text-[#003135] mb-6">Create New Link</h2>

          <form action={createLink} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g., Event Registration"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#0FA4AF] focus:ring-2 focus:ring-[#0FA4AF] focus:ring-opacity-20 outline-none transition-colors"
                />
              </div>

              {/* Original URL */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Destination URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  name="originalUrl"
                  placeholder="https://example.com"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#0FA4AF] focus:ring-2 focus:ring-[#0FA4AF] focus:ring-opacity-20 outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Custom Alias */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Custom Alias
                </label>
                <input
                  type="text"
                  name="customAlias"
                  placeholder="Leave blank for auto-generated"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#0FA4AF] focus:ring-2 focus:ring-[#0FA4AF] focus:ring-opacity-20 outline-none transition-colors"
                />
              </div>

              {/* Max Clicks */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Max Clicks (Optional)
                </label>
                <input
                  type="number"
                  name="maxClicks"
                  placeholder="Unlimited if left blank"
                  min="1"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#0FA4AF] focus:ring-2 focus:ring-[#0FA4AF] focus:ring-opacity-20 outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Starts At */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Starts At
                </label>
                <input
                  type="datetime-local"
                  name="startsAt"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#0FA4AF] focus:ring-2 focus:ring-[#0FA4AF] focus:ring-opacity-20 outline-none transition-colors"
                />
              </div>

              {/* Expires At */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Expires At
                </label>
                <input
                  type="datetime-local"
                  name="expiresAt"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#0FA4AF] focus:ring-2 focus:ring-[#0FA4AF] focus:ring-opacity-20 outline-none transition-colors"
                />
              </div>
            </div>

            {/* Alternate URL */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Waitlist URL (Alternate)
              </label>
              <input
                type="url"
                name="alternateUrl"
                placeholder="https://waitlist.example.com"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#0FA4AF] focus:ring-2 focus:ring-[#0FA4AF] focus:ring-opacity-20 outline-none transition-colors"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#0FA4AF] hover:bg-[#024950] text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              Create Link
            </button>
          </form>
        </div>

        {/* Links List Section */}
        <div>
          <h2 className="text-2xl font-bold text-[#003135] mb-6">Your Links</h2>

          {links.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-[#AFDDE5] p-12 text-center">
              <p className="text-gray-500 text-lg">No links created yet</p>
              <p className="text-gray-400 text-sm mt-2">Create your first link above to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {links.map((link) => {
                const { status, color } = getStatusBadge(link);
                const fullUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/${link.slug}`;

                return (
                  <div
                    key={link.id}
                    className="bg-white rounded-xl shadow-sm border border-[#AFDDE5] p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      {/* Link Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold text-[#003135] truncate">
                            {link.title}
                          </h3>
                          <span className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ${color}`}>
                            {status}
                          </span>
                        </div>

                        <div className="space-y-2 text-sm text-gray-600 mb-4">
                          <p className="flex items-center gap-2">
                            <span className="font-medium">Slug:</span>
                            <code className="bg-gray-100 px-2 py-1 rounded text-[#003135] font-mono">
                              /{link.slug}
                            </code>
                          </p>
                          <p className="flex items-center gap-2">
                            <span className="font-medium">Destination:</span>
                            <span className="truncate">{link.originalUrl}</span>
                          </p>
                          <p className="flex items-center gap-2">
                            <span className="font-medium">Clicks:</span>
                            <span className="text-[#0FA4AF] font-semibold">{link.totalClicks}</span>
                            {link.maxClicks && (
                              <span className="text-gray-500">/ {link.maxClicks}</span>
                            )}
                          </p>
                          <p className="text-gray-500">
                            Created {new Date(link.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 flex-wrap md:flex-col md:items-end">
                        <CopyButton text={fullUrl} label="Copy Link" />

                        <a
                          href={`/dashboard/edit/${link.id}`}
                          className="px-4 py-2 bg-[#024950] hover:bg-[#003135] text-white rounded-lg font-medium transition-colors text-sm text-center"
                        >
                          ✏️ Edit
                        </a>

                        <DeleteLinkForm linkId={link.id} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}