import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    async signIn({ profile }) {
      const email = profile?.email;
      if (!email) return false;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !user.isAuthorized) return false;

      // DEMO ACCOUNTS: gmail allowed temporarily for judge demonstration.
      // In production, replace seed emails with real @nmamit.in accounts
      // and remove this block — only @nmamit.in and @nitte.edu.in will be accepted.
      const isDemoAccount = email.endsWith("@gmail.com");
      if (isDemoAccount) return true;

      const isFaculty = user.flcPosition === "FACULTY_COORDINATOR";
      if (isFaculty && !email.endsWith("@nitte.edu.in")) return false;
      if (!isFaculty && !email.endsWith("@nmamit.in")) return false;

      return true;
    },

    async jwt({ token }) {
      if (!token.email) return token;

      const user = await prisma.user.findUnique({
        where: { email: token.email },
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
      session.user.position = token.position as string;
      session.user.isAuthorized = token.isAuthorized as boolean;
      return session;
    },
  },
});