import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  return handleLogout(request);
}

export async function POST(request: Request) {
  return handleLogout(request);
}

async function handleLogout(request: Request) {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();

  const response = NextResponse.redirect(new URL("/login", request.url));

  // Clear all Auth.js and NextAuth cookies unconditionally
  for (const cookie of allCookies) {
    if (
      cookie.name.includes("authjs") ||
      cookie.name.includes("next-auth") ||
      cookie.name.includes("session")
    ) {
      response.cookies.set(cookie.name, "", {
        path: "/",
        maxAge: 0,
        expires: new Date(0),
      });
    }
  }

  // Also explicitly clear standard cookie names
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
  ];

  for (const name of standardCookies) {
    response.cookies.set(name, "", {
      path: "/",
      maxAge: 0,
      expires: new Date(0),
    });
  }

  return response;
}
