import { NextRequest, NextResponse } from 'next/server'

export default function middleware(req: NextRequest) {
  const loggedin = req.cookies.get('authToken')
  const { pathname } = req.nextUrl

  const response = NextResponse.next()
  response.headers.set('Cache-Control', 'no-store')

  const searchParams = req.nextUrl.searchParams
  const externalUrlParam = searchParams.get('external_url')

  if (loggedin && (pathname === '/signIn' || pathname === '/signUp')) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  if (!loggedin && pathname !== '/signIn' && pathname !== '/signUp') {
    const signInRoute = externalUrlParam ? `/signIn?external_url=${externalUrlParam}` : '/signIn'
    return NextResponse.redirect(new URL(signInRoute, req.url))
  }

  return response
}

export const config = {
  matcher: ['/', '/((?!api|static|.*\\..*|_next).*)']
}
