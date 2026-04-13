import { NextResponse, type NextRequest } from "next/server";

function getApiUrl() {
  return process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_URL || "https://app.server-veepearl.orb.local/api/v1"
    : process.env.NEXT_PUBLIC_API_URL;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const guestPaths = ["/login", "/register", "/verify-account"];
  const protectedPaths = ["/dashboard"];

  const isGuestPath = guestPaths.some((p) => pathname.startsWith(p));
  const isProtectedPath = protectedPaths.some((p) => pathname.startsWith(p));

  // The backend sets the session token in an HttpOnly cookie named "session_token"
  // In cross-site development, we use "token_mirror" set by the frontend.
  const sessionToken =
    request.cookies.get("session_token")?.value ||
    request.cookies.get("token_mirror")?.value;

  // 1. Root redirect
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // CASE 1: Authenticated user attempting to access guest-only routes
  if (isGuestPath && sessionToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // CASE 2: No session token for protected routes
  if (isProtectedPath && !sessionToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // CASE 3: Validate session and role for protected routes
  if (isProtectedPath && sessionToken) {
    const baseUrl = getApiUrl();
    if (!baseUrl) return NextResponse.next();

    try {
      // Validate session via backend refresh
      const res = await fetch(`${baseUrl}/auth/refresh_token`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ session_token: sessionToken }),
      });

      if (res.status === 401) {
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete("session_token");
        return response;
      }

      const responseData = await res.json();
      const userRole = responseData?.data?.role?.toLowerCase();

      // Block access ONLY for 'customer' role
      if (userRole === "customer") {
        return NextResponse.redirect(
          new URL("/login?error=unauthorized", request.url)
        );
      }

      return NextResponse.next();
    } catch (error) {
      // On network error or other server errors, allow the request to proceed
      // and let client-side guards handle the state hydration/error display.
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images).*)"],
};
