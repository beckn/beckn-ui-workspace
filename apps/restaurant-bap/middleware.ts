import { NextRequest, NextResponse } from 'next/server'

export default function middleware(req: NextRequest) {
  // Authentication disabled for now - allow all routes
  const response = NextResponse.next()
  response.headers.set('Cache-Control', 'no-store')

  return response
}

export const config = {
  matcher: ['/', '/((?!api|static|.*\\..*|_next).*)']
}
