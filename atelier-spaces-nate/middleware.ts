import { auth } from './lib/auth'

export default auth((req) => {
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
  const isLoginPage = req.nextUrl.pathname === '/admin/login'
  const isLoggedIn = !!req.auth

  if (isAdminRoute && !isLoginPage && !isLoggedIn) {
    const loginUrl = new URL('/admin/login', req.nextUrl.origin)
    loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname)
    return Response.redirect(loginUrl)
  }

  if (isLoginPage && isLoggedIn) {
    return Response.redirect(new URL('/admin/dashboard', req.nextUrl.origin))
  }

  return undefined
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
