// middleware.ts

import { NextRequest, NextResponse } from 'next/server'

export default function middleware(req: NextRequest) {
  const loggedin = req.cookies.get('authToken')
  const { pathname } = req.nextUrl

  // once API is integrated then we can add middleware
  if (loggedin && (pathname === '/signIn' || pathname === '/signUp')) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  if (!loggedin && pathname === '/resetPassword') {
    return NextResponse.next()
  }

  if (!loggedin && pathname !== '/signIn' && pathname !== '/signUp') {
    const signInRoute = '/signIn'

    return NextResponse.redirect(new URL(signInRoute, req.url))
  }

  // It's important to return a response for all paths, you might want to return `undefined` or `NextResponse.next()`
  // for other cases to let the request continue.
  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/((?!api|static|.*\\..*|_next).*)']
}
