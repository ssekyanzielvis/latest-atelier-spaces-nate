import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow access to login page
  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  // Check for Supabase auth token in cookies
  const authToken = request.cookies.get('sb-access-token')?.value

  // Redirect to login if no auth token for admin routes
  if (!authToken && pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/admin/login'
    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Only match admin routes, excluding static files and API routes
    '/admin/:path*',
  ],
}
