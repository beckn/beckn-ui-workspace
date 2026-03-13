// middleware.ts

import { NextRequest, NextResponse } from 'next/server'

const publicPaths = [
  '/signIn',
  '/signUp',
  '/OTPVerification',
  '/discovery',
  '/detailView',
  '/searchByLocation',
  '/cart',
  '/checkout',
  '/paymentMode',
  '/orderConfirmation'
]

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const authToken = req.cookies.get('authToken')?.value

  // Home removed: redirect / to searchByLocation (or signIn with returnUrl if not authenticated)
  if (pathname === '/') {
    if (!authToken) {
      const signInUrl = new URL('/signIn', req.url)
      signInUrl.searchParams.set('returnUrl', '/searchByLocation')
      return NextResponse.redirect(signInUrl)
    }
    return NextResponse.redirect(new URL('/searchByLocation', req.url))
  }

  if (publicPaths.includes(pathname)) {
    return NextResponse.next()
  }

  // Protected routes: require auth token
  if (!authToken && pathname === '/profile') {
    const signInUrl = new URL('/signIn', req.url)
    signInUrl.searchParams.set('returnUrl', '/profile')
    return NextResponse.redirect(signInUrl)
  }

  if (!authToken && pathname === '/orderHistory') {
    const signInUrl = new URL('/signIn', req.url)
    signInUrl.searchParams.set('returnUrl', '/orderHistory')
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/((?!api|static|.*\\..*|_next).*)']
}
