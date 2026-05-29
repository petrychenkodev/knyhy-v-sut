import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Redirect old /uk/* URLs to /* for backwards compat
  if (pathname.startsWith('/uk')) {
    const newPath = pathname.replace(/^\/uk/, '') || '/'
    return NextResponse.redirect(new URL(newPath, request.url))
  }

  // Redirect /en/* to /* as well
  if (pathname.startsWith('/en')) {
    const newPath = pathname.replace(/^\/en/, '') || '/'
    return NextResponse.redirect(new URL(newPath, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|api|admin|favicon.ico|.*\\..*).*)'],
}
