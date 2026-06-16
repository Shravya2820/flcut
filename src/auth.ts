// FLCUT-AI-2627-visible

import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import email from "next-auth/providers/email";

export const {
  handlers,
  signIn,
  signOut,
  auth,
} = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ profile }) {
  console.log("================================");
  console.log("LOGIN EMAIL:", profile?.email);
  console.log("================================");

  const email = profile?.email;

      if (!email) {
        return false;
      }

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return false;
      }

      if (!user.isAuthorized) {
        return false;
      }

      const isFaculty =
        user.flcPosition === "FACULTY_COORDINATOR";

      if (
        isFaculty &&
        !email.endsWith("@nitte.edu.in")
      ) {
        return false;
      }

      if (
        !isFaculty &&
        !email.endsWith("@nmamit.in")
      ) {
        return false;
      }

      return true;
    },

    async jwt({ token }) {
      if (!token.email) {
        return token;
      }

      const user = await prisma.user.findUnique({
        where: {
          email: token.email,
        },
      });

      if (!user) {
        token.isAuthorized = false;
        return token;
      }

      token.role = user.systemRole;
      token.position = user.flcPosition;
      token.isAuthorized = user.isAuthorized;

      return token;
    },

    async session({ session, token }) {
      session.user.role = token.role as string;
      session.user.position =
        token.position as string;

      session.user.isAuthorized =
        token.isAuthorized as boolean;

      return session;
    },
  },
});