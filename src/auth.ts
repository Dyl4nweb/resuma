import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authConfig } from "./auth.config";

const loginSchema = z.object({
  email: z.string().email(),
  pin: z.string().optional(),
  password: z.string().optional(),
  authMode: z.string().optional(),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        pin: { label: "PIN", type: "password" },
        password: { label: "Password", type: "password" },
        authMode: { label: "Auth Mode", type: "text" },
      },
      async authorize(credentials) {
        const parsedCredentials = loginSchema.safeParse(credentials);

        if (!parsedCredentials.success) {
          return null;
        }

        const { email, pin, password, authMode } = parsedCredentials.data;
        const normalizedEmail = email.toLowerCase().trim();

        const user = await prisma.user.findUnique({
          where: { email: normalizedEmail },
        });

        if (!user) {
          return null;
        }

        let authenticated = false;

        // 1. PIN-based authentication
        if (pin && (authMode === "pin" || !password)) {
          if (user.pinHash) {
            authenticated = await bcrypt.compare(pin, user.pinHash);
          }
          // Backward-compatibility fallback: check passwordHash if pinHash isn't set
          if (!authenticated && user.passwordHash) {
            authenticated = await bcrypt.compare(pin, user.passwordHash);
          }
        }

        // 2. Password-based authentication
        if (!authenticated && password && (authMode === "password" || !pin)) {
          if (user.passwordHash) {
            authenticated = await bcrypt.compare(password, user.passwordHash);
          }
        }

        // 3. Fallback: single input passed in 'pin' could be either
        if (!authenticated && pin && user.passwordHash) {
          authenticated = await bcrypt.compare(pin, user.passwordHash);
        }

        if (!authenticated) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          subscriptionTier: user.subscriptionTier,
          hasPin: Boolean(user.pinHash),
        };
      },
    }),
  ],
});
