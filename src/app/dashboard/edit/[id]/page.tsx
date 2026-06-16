import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { updateLink } from "@/app/actions/update-link";
import Link from "next/link";

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
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-[#AFDDE5]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/dashboard"
            className="text-[#0FA4AF] hover:text-[#024950] font-medium mb-4 inline-flex items-center gap-2 transition-colors"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-[#003135]">Edit Link</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Link Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-[#AFDDE5] p-6 mb-8">
          <h2 className="text-lg font-semibold text-[#003135] mb-4">Link Summary</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 text-sm">Short URL</p>
              <p className="font-mono text-[#0FA4AF] font-semibold">
                /{link.slug}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Clicks</p>
              <p className="text-2xl font-bold text-[#003135]">
                {link.totalClicks}
              </p>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <form
          action={updateLink.bind(null, link.id)}
          className="bg-white rounded-xl shadow-sm border border-[#AFDDE5] p-8"
        >
          <h2 className="text-2xl font-bold text-[#003135] mb-6">Edit Details</h2>

          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                defaultValue={link.title}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#0FA4AF] focus:ring-2 focus:ring-[#0FA4AF] focus:ring-opacity-20 outline-none transition-colors"
                placeholder="Link title"
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
                defaultValue={link.originalUrl}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#0FA4AF] focus:ring-2 focus:ring-[#0FA4AF] focus:ring-opacity-20 outline-none transition-colors"
                placeholder="https://example.com"
              />
            </div>

            {/* Starts At and Expires At */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#0FA4AF] focus:ring-2 focus:ring-[#0FA4AF] focus:ring-opacity-20 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#0FA4AF] focus:ring-2 focus:ring-[#0FA4AF] focus:ring-opacity-20 outline-none transition-colors"
                />
              </div>
            </div>

            {/* Max Clicks and Alternate URL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Max Clicks (Optional)
                </label>
                <input
                  type="number"
                  name="maxClicks"
                  defaultValue={link.maxClicks ?? ""}
                  min="1"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#0FA4AF] focus:ring-2 focus:ring-[#0FA4AF] focus:ring-opacity-20 outline-none transition-colors"
                  placeholder="Leave blank for unlimited"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Waitlist URL (Alternate)
                </label>
                <input
                  type="url"
                  name="alternateUrl"
                  defaultValue={link.alternateUrl ?? ""}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#0FA4AF] focus:ring-2 focus:ring-[#0FA4AF] focus:ring-opacity-20 outline-none transition-colors"
                  placeholder="https://waitlist.example.com"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-6 border-t border-gray-200">
              <button
                type="submit"
                className="flex-1 bg-[#0FA4AF] hover:bg-[#024950] text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg"
              >
                Save Changes
              </button>
              <Link
                href="/dashboard"
                className="px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-lg transition-colors"
              >
                Cancel
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}