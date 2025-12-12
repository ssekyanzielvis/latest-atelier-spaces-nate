import { auth } from './lib/auth'

export default auth((req) => {
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
  const isLoginPage = req.nextUrl.pathname === '/admin/login'
  const isAuthRoute = req.nextUrl.pathname.startsWith('/api/auth')
  const isLoggedIn = !!req.auth

  // Don't redirect auth routes
  if (isAuthRoute) {
    return undefined
  }

  // Redirect to login if trying to access admin routes without authentication
  if (isAdminRoute && !isLoginPage && !isLoggedIn) {
    const loginUrl = new URL('/admin/login', req.nextUrl.origin)
    loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname)
    return Response.redirect(loginUrl)
  }

  // Redirect to dashboard if already logged in and trying to access login page
  if (isLoginPage && isLoggedIn) {
    return Response.redirect(new URL('/admin/dashboard', req.nextUrl.origin))
  }

  return undefined
})

export const config = {
  matcher: [
    // Match all admin routes except static files
    '/admin/:path*',
  ],
}
