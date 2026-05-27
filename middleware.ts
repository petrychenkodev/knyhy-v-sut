import { NextRequest, NextResponse } from 'next/server'

const VALID_LOCALES = ['uk', 'en']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip internal Next.js paths and static files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Root → /uk
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/uk', request.url))
  }

  // Check first segment is a valid locale
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length > 0 && !VALID_LOCALES.includes(segments[0])) {
    return NextResponse.redirect(new URL('/uk', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
