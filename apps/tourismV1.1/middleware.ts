import { NextRequest, NextResponse } from 'next/server'

export default function middleware(req: NextRequest) {
  const loggedin = req.cookies.get('authToken')
  const { pathname } = req.nextUrl
  const isFrench = pathname.startsWith('/fa')
  const signInPath = isFrench ? '/fa/signin' : '/signin'
  const signUpPath = isFrench ? '/fa/signUp' : '/signUp'
  const homePath = isFrench ? '/fa' : '/'

  console.log('Path:', pathname, 'Logged in:', loggedin)

  if (loggedin && (pathname === signInPath || pathname === signUpPath)) {
    return NextResponse.redirect(new URL(homePath, req.url))
  }

  if (!loggedin && pathname !== signInPath && pathname !== signUpPath) {
    return NextResponse.redirect(new URL(signInPath, req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/fa', '/signin', '/signUp', '/fa/signin', '/fa/signUp', '/((?!api|static|.*\\..*|_next).*)']
}
