import { signOut } from "@/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  return handleLogout(request);
}

export async function POST(request: Request) {
  return handleLogout(request);
}

async function handleLogout(request: Request) {
  try {
    await signOut({ redirect: false });
  } catch (err) {
    console.error("NextAuth signOut error in /api/auth/logout:", err);
  }

  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();

  const response = NextResponse.redirect(new URL("/login", request.url));

  const clearCookie = (name: string) => {
    try {
      cookieStore.delete(name);
    } catch {}

    // Set-Cookie header with secure: true (mandatory for __Secure- and __Host- cookies)
    response.cookies.set(name, "", {
      path: "/",
      maxAge: 0,
      expires: new Date(0),
      secure: true,
      httpOnly: true,
      sameSite: "lax",
    });

    // Set-Cookie header with secure: false (for non-secure localhost cookies)
    response.cookies.set(name, "", {
      path: "/",
      maxAge: 0,
      expires: new Date(0),
      secure: false,
      httpOnly: true,
      sameSite: "lax",
    });
  };

  // Clear all Auth.js and NextAuth cookies unconditionally
  for (const cookie of allCookies) {
    if (
      cookie.name.includes("authjs") ||
      cookie.name.includes("next-auth") ||
      cookie.name.includes("session") ||
      cookie.name.includes("csrf") ||
      cookie.name.includes("callback")
    ) {
      clearCookie(cookie.name);
    }
  }

  // Also explicitly clear all standard Auth.js and NextAuth cookie names
  const standardCookies = [
    "authjs.session-token",
    "__Secure-authjs.session-token",
    "authjs.csrf-token",
    "__Host-authjs.csrf-token",
    "authjs.callback-url",
    "__Secure-authjs.callback-url",
    "next-auth.session-token",
    "__Secure-next-auth.session-token",
    "next-auth.csrf-token",
    "next-auth.callback-url",
    "__Host-next-auth.csrf-token",
  ];

  for (const name of standardCookies) {
    clearCookie(name);
  }

  return response;
}
