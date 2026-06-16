import { signIn } from "@/auth";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#AFDDE5] via-white to-[#AFDDE5] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-[#AFDDE5]">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#003135] rounded-xl mb-4">
              <span className="text-3xl">✂️</span>
            </div>
            <h1 className="text-4xl font-bold text-[#003135] mb-2">FLCut</h1>
            <p className="text-gray-600 text-sm">Official URL Management Platform</p>
          </div>

          {/* Subtitle */}
          <div className="text-center mb-8">
            <p className="text-gray-700 font-medium mb-2">Welcome to FLCut</p>
            <p className="text-gray-600 text-sm">
              Official URL Management Platform for Finite Loop Club
            </p>
          </div>

          {/* Description */}
          <div className="bg-[#f8fafb] rounded-lg p-4 mb-8 border border-[#AFDDE5]">
            <p className="text-gray-700 text-sm leading-relaxed">
              Manage, track, and optimize all your links in one powerful platform. Create short URLs, monitor clicks, and control access with ease.
            </p>
          </div>

          {/* Sign In Button */}
          <form
            action={async () => {
              "use server";
              await signIn("google", {
                redirectTo: "/dashboard",
              });
            }}
            className="w-full"
          >
            <button
              type="submit"
              className="w-full px-6 py-3 bg-[#0FA4AF] hover:bg-[#024950] text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Sign in with Google
              </span>
            </button>
          </form>

          {/* Footer Note */}
          <p className="text-center text-xs text-gray-500 mt-6">
            Only authorized FLC core committee members can access this platform.
          </p>
        </div>
      </div>
    </main>
  );
}