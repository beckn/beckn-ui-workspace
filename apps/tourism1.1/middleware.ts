// middleware.ts

import { NextRequest, NextResponse } from 'next/server'

export default function middleware(req: NextRequest) {
  // TypeScript will correctly understand the type of `loggedin`
  // const loggedin = req.cookies.get('authToken')
  // const { pathname } = req.nextUrl
  // console.log('Dank', pathname, loggedin)

  // if (loggedin && (pathname === '/signin' || pathname === '/signUp')) {
  //   // Correctly redirect to the home page if the user is already logged in
  //   return NextResponse.redirect(new URL('/', req.url))
  // }

  // if (!loggedin && pathname !== '/signin' && pathname !== '/signUp') {
  //   // Redirect to the signin page if the user is not logged in
  //   return NextResponse.redirect(new URL('/signin', req.url))
  // }

  // It's important to return a response for all paths, you might want to return `undefined` or `NextResponse.next()`
  // for other cases to let the request continue.
  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/((?!api|static|.*\\..*|_next).*)']
}
