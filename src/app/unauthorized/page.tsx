import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#AFDDE5] via-white to-[#AFDDE5] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-[#AFDDE5] text-center">
          {/* Error Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
            <span className="text-4xl">🔒</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-bold text-[#003135] mb-4">Access Restricted</h1>

          {/* Message */}
          <p className="text-gray-600 text-base leading-relaxed mb-8">
            You are not part of the authorized FLC core committee.
          </p>

          {/* Explanation */}
          <div className="bg-[#f8fafb] rounded-lg p-4 mb-8 border border-[#AFDDE5]">
            <p className="text-gray-700 text-sm">
              Contact an administrator if you believe this is a mistake.
            </p>
          </div>

          {/* Return Button */}
          <Link
            href="/"
            className="inline-block w-full px-6 py-3 bg-[#0FA4AF] hover:bg-[#024950] text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg"
          >
            Return Home
          </Link>

          {/* Additional Help */}
          <p className="text-gray-500 text-xs mt-6">
            If you have questions, please reach out to FLC leadership.
          </p>
        </div>
      </div>
    </main>
  );
}