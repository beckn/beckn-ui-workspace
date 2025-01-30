// middleware.ts

import { NextRequest, NextResponse } from 'next/server'

export default function middleware(req: NextRequest) {
  const loggedin = req.cookies.get('authToken')
  const isVerified = req.cookies.get('isVerified')?.value === 'true'
  const { pathname } = req.nextUrl
  const response = NextResponse.next()
  response.headers.set('Cache-Control', 'no-store')

  if (loggedin && !isVerified && !['/signIn', '/signUp', '/OTPVerification'].includes(pathname)) {
    return NextResponse.redirect(new URL('/signIn', req.url))
  }

  if (loggedin && isVerified && ['/signIn', '/signUp', '/OTPVerification'].includes(pathname)) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  if (!loggedin && !['/signIn', '/signUp', '/OTPVerification'].includes(pathname)) {
    return NextResponse.redirect(new URL('/signIn', req.url))
  }

  return response
}

export const config = {
  matcher: ['/', '/((?!api|static|.*\\..*|_next).*)']
}
