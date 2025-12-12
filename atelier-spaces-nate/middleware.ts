import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Allow all requests to pass through
  // Authentication is handled in the admin layout
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Only match admin routes, excluding static files and API routes
    '/admin/:path*',
  ],
}
