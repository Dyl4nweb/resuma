import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  trustHost: true,
  secret:
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    "resuma_super_secret_session_key_32_characters_minimum_production_safe",
  pages: {
    signIn: "/login",
    newUser: "/dashboard",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isEditor = nextUrl.pathname.startsWith("/resumes");

      if (isDashboard || isEditor) {
        if (isLoggedIn) return true;
        return false; // Redirect to /login
      }
      return true;
    },
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        token.subscriptionTier = (user as any).subscriptionTier ?? "FREE";
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        token.role = (user as any).role ?? "USER";
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        token.hasPin = (user as any).hasPin ?? false;
      }
      if (trigger === "update" && session?.subscriptionTier) {
        token.subscriptionTier = session.subscriptionTier;
      }
      if (trigger === "update" && typeof session?.hasPin === "boolean") {
        token.hasPin = session.hasPin;
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as any).subscriptionTier = token.subscriptionTier as string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as any).role = token.role as string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as any).hasPin = Boolean(token.hasPin);
      }
      return session;
    },
  },
  providers: [], // Added in auth.ts with full Node-only dependencies
} satisfies NextAuthConfig;
