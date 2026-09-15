import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  // Protect /dashboard and /resumes routes, and ignore static files/images/api
  matcher: ["/dashboard/:path*", "/resumes/:path*"],
};
