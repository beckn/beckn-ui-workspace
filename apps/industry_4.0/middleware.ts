// middleware.ts

import { NextRequest, NextResponse } from 'next/server'

export default function middleware(req: NextRequest) {
  const loggedin = req.cookies.get('authToken')
  const { pathname } = req.nextUrl

  const response = NextResponse.next()
  response.headers.set('Cache-Control', 'no-store')

  const searchParams = req.nextUrl.searchParams

  const externalUrlParam = searchParams.get('external_url')

  if (loggedin && (pathname === '/signin' || pathname === '/signUp')) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  if (!loggedin && pathname !== '/signin' && pathname !== '/signUp') {
    const signInRoute = externalUrlParam ? `/signin?external_url=${externalUrlParam}` : '/signin'

    return NextResponse.redirect(new URL(signInRoute, req.url))
  }

  // It's important to return a response for all paths, you might want to return `undefined` or `NextResponse.next()`
  // for other cases to let the request continue.
  return response
}

export const config = {
  matcher: ['/', '/((?!api|static|.*\\..*|_next).*)']
}
