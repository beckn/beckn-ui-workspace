import { NextRequest, NextResponse } from 'next/server'

export default function middleware(req: NextRequest) {
  const loggedin = req.cookies.get('authToken')
  const { pathname } = req.nextUrl

  // Create a response with no-store caching
  const response = NextResponse.next()
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')

  const searchParams = req.nextUrl.searchParams
  const externalUrlParam = searchParams.get('external_url')

  // Redirect logged-in users away from sign-in or sign-up pages
  if (loggedin && (pathname === '/signIn' || pathname === '/signUp')) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  // Redirect non-logged-in users to the sign-in page
  if (!loggedin && pathname !== '/signIn' && pathname !== '/signUp') {
    const signInRoute = externalUrlParam ? `/signIn?external_url=${externalUrlParam}` : '/signIn'

    return NextResponse.redirect(new URL(signInRoute, req.url))
  }

  // Allow the request to proceed if no conditions are met
  return response
}

export const config = {
  matcher: ['/', '/((?!api|static|.*\\..*|_next).*)']
}
