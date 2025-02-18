// middleware.ts

import { NextRequest, NextResponse } from 'next/server'

export default function middleware(req: NextRequest) {
  const loggedin = req.cookies.get('authToken')
  const isVerified = req.cookies.get('isVerified')?.value === 'true'
  const { pathname } = req.nextUrl

  if (loggedin && !isVerified && pathname !== '/signIn' && pathname !== '/signUp' && pathname !== '/OTPVerification') {
    return NextResponse.redirect(new URL('/signIn', req.url))
  }

  if (loggedin && isVerified && (pathname === '/signIn' || pathname === '/signUp' || pathname === '/OTPVerification')) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  // currently not allowed to nav /welcome page once role selected, pathname !== '/welcome'
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
