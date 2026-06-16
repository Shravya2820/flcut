"use client";

import React from "react";
import Link from "next/link";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";

interface NavbarProps {
  session: Session | null;
}

const getRoleBadgeColor = (role: string): string => {
  switch (role) {
    case "ADMIN":
      return "bg-[#964734] text-white";
    case "MANAGER":
      return "bg-[#024950] text-white";
    case "MEMBER":
      return "bg-[#0FA4AF] text-white";
    default:
      return "bg-gray-400 text-white";
  }
};

export default function Navbar({ session }: NavbarProps) {
  if (!session?.user) {
    return null;
  }

  const userRole = (session.user as any).systemRole || "MEMBER";
  const userName = session.user.name || "User";

  return (
    <nav className="sticky top-0 z-50 bg-[#003135] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left: Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-[#0FA4AF] rounded-lg flex items-center justify-center font-bold text-[#003135]">
              ✂️
            </div>
            <span className="text-lg font-bold">FLCut</span>
          </Link>

          {/* Right: User Info and Logout */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium">{userName}</p>
                <p className={`text-xs px-2 py-0.5 rounded-full font-semibold ${getRoleBadgeColor(userRole)}`}>
                  {userRole}
                </p>
              </div>
              {session.user.image && (
                <img
                  src={session.user.image}
                  alt={userName}
                  className="w-10 h-10 rounded-full border-2 border-[#0FA4AF]"
                />
              )}
            </div>

            <button
              onClick={async () => {
                await signOut({ redirectTo: "/" });
              }}
              className="px-4 py-2 bg-[#0FA4AF] hover:bg-[#024950] text-white rounded-lg font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
