import { NextRequest, NextResponse } from 'next/server'

const locals = ['fa']

export default function middleware(req: NextRequest) {
  const loggedin = req.cookies.get('authToken')
  const { pathname, href, host } = req.nextUrl
  const tourismType = req.cookies.get('tourismType')?.value || ''
  console.log('Dank', pathname, host, href)
  const urlSplitList = href.split('/')
  const hostIndex = urlSplitList.findIndex(item => item === host)
  let langSuffix = ''
  if (urlSplitList[hostIndex + 1] && locals.includes(urlSplitList[hostIndex + 1])) {
    langSuffix = urlSplitList[hostIndex + 1]
  }

  if (loggedin && (pathname === '/signIn' || pathname === '/signUp')) {
    const redirectUrl = tourismType ? `/?tourismType=${tourismType}` : '/'
    return NextResponse.redirect(new URL(redirectUrl, req.url))
  }

  if (!loggedin && pathname !== '/signIn' && pathname !== '/signUp') {
    const redirectUrl = `/signIn${tourismType ? `?tourismType=${tourismType}` : ''}`
    return NextResponse.redirect(new URL(redirectUrl, req.url))
  }

  if (!loggedin && pathname !== '/signIn' && pathname !== '/signUp') {
    const redirectUrl = langSuffix ? `/${langSuffix}/signIn` : '/signIn'
    console.log('Dank', langSuffix, redirectUrl)
    return NextResponse.redirect(new URL(redirectUrl, req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/((?!api|static|.*\\..*|_next).*)']
}
