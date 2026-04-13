import { NextResponse, type NextRequest } from "next/server";

function getApiUrl() {
  return process.env.NEXT_PUBLIC_API_URL;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const guestPaths = ["/login", "/register", "/verify-account"];
  const protectedPaths = ["/dashboard"];

  const isGuestPath = guestPaths.some((p) => pathname.startsWith(p));
  const isProtectedPath = protectedPaths.some((p) => pathname.startsWith(p));

  // Server-set HttpOnly cookie (from same-domain backend)
  const sessionToken = request.cookies.get("session_token")?.value;
  // Client-set cookie (access_token, set manually after login for cross-domain)
  const tokenMirror = request.cookies.get("token_mirror")?.value;

  const hasAnyToken = !!(sessionToken || tokenMirror);

  // 1. Root redirect
  if (pathname === "/") {
    return NextResponse.redirect(new URL(hasAnyToken ? "/dashboard" : "/login", request.url));
  }

  // CASE 1: Authenticated user attempting to access guest-only routes
  // If token_mirror exists, user just logged in - trust it directly
  if (isGuestPath && tokenMirror) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // CASE 2: No token at all for protected routes → redirect to login
  if (isProtectedPath && !hasAnyToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // CASE 3: Has token_mirror (client-set access_token) → trust it directly
  // The access_token is short-lived and was just issued, so we trust it
  if (isProtectedPath && tokenMirror) {
    return NextResponse.next();
  }

  // CASE 4: Has only session_token → validate via backend
  if (isProtectedPath && sessionToken) {
    const baseUrl = getApiUrl();
    if (!baseUrl) return NextResponse.next();

    try {
      const res = await fetch(`${baseUrl}/auth/refresh_token`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ session_token: sessionToken }),
      });

      if (res.status === 401) {
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete("session_token");
        response.cookies.delete("token_mirror");
        return response;
      }

      const responseData = await res.json();
      const userRole = responseData?.data?.role?.toLowerCase();

      // Block access ONLY for 'customer' role
      if (userRole === "customer") {
        const response = NextResponse.redirect(
          new URL("/login?error=unauthorized", request.url)
        );
        response.cookies.delete("session_token");
        response.cookies.delete("token_mirror");
        return response;
      }

      return NextResponse.next();
    } catch (error) {
      // On network error, allow the request to proceed
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images).*)"],
};
