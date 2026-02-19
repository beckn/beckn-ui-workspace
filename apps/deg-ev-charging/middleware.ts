// middleware.ts

import { NextRequest, NextResponse } from 'next/server'

const publicPaths = [
  '/signIn',
  '/signUp',
  '/OTPVerification',
  '/discovery',
  '/detailView',
  '/cart',
  '/checkout',
  '/paymentMode',
  '/orderConfirmation'
]

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const authToken = req.cookies.get('authToken')?.value

  // Unauthenticated users opening home are sent to sign-in page
  if (pathname === '/' && !authToken) {
    return NextResponse.redirect(new URL('/signIn', req.url))
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
