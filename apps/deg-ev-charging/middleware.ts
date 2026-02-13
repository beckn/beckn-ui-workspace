// middleware.ts

import { NextRequest, NextResponse } from 'next/server'

export default function middleware(req: NextRequest) {
  const loggedin = req.cookies.get('authToken')
  const isVerified = req.cookies.get('isVerified')?.value === 'true'
  const { pathname } = req.nextUrl

  // Public pages that don't require authentication
  const publicPages = ['/', '/discovery', '/detailView']

  // Allow home page without authentication - return early
  if (pathname === '/') {
    return NextResponse.next()
  }

  // Redirect all sign-in/sign-up pages to discovery (bypass auth completely)
  if (
    pathname === '/signin' ||
    pathname === '/signup' ||
    pathname === '/signIn' ||
    pathname === '/signUp' ||
    pathname === '/OTPVerification'
  ) {
    return NextResponse.redirect(new URL('/discovery', req.url))
  }

  // Allow public pages without authentication - return early
  if (publicPages.includes(pathname)) {
    return NextResponse.next()
  }

  // For logged in but not verified users, redirect to discovery (not signIn)
  if (loggedin && !isVerified && !publicPages.includes(pathname)) {
    return NextResponse.redirect(new URL('/discovery', req.url))
  }

  // For non-logged in users trying to access protected pages, redirect to discovery (not signIn)
  if (!loggedin && !publicPages.includes(pathname)) {
    return NextResponse.redirect(new URL('/discovery', req.url))
  }

  // Allow all other requests to continue
  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/((?!api|static|.*\\..*|_next).*)']
}
