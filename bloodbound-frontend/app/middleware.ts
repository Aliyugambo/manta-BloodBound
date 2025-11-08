import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware runs on every request to protected routes
export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value; // check if JWT token exists

  // ✅ If accessing dashboard routes without token — redirect to login
  if (request.nextUrl.pathname.startsWith('/dashboard') && !token) {
    const loginUrl = new URL('/auth?tab=login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // ✅ Optionally prevent verified users from going back to /auth once logged in
  if (request.nextUrl.pathname.startsWith('/auth') && token) {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

// Apply this middleware to specific paths
export const config = {
  matcher: [
    '/dashboard/:path*', // protect dashboard routes
    '/auth/:path*',      // optional: prevent accessing auth pages when logged in
  ],
};
