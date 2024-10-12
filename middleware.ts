// middleware.ts

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_FILE = /\.(.*)$/;

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

const defaultLocale = 'es'
const locales = ['es', 'en']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    pathname.startsWith('/_next') ||
    pathname.includes('/api/') ||
    pathname.startsWith('/images/') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next()
  }

  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  if (pathnameIsMissingLocale) {
    const preferredLanguage = request.cookies.get('preferredLanguage')?.value || defaultLocale
    return NextResponse.redirect(new URL(`/${preferredLanguage}${pathname}`, request.url))
  }

  return NextResponse.next()
}