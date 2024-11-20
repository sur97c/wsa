// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_FILE = /\.(.*)$/

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // No procesar archivos públicos o rutas de API
  if (
    PUBLIC_FILE.test(pathname) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api')
  ) {
    return
  }

  // Si ya tiene un locale válido, no hacer nada
  if (pathname.startsWith('/es/') || pathname.startsWith('/en/')) {
    return
  }

  // Si es solo /es o /en sin trailing slash, no hacer nada
  if (pathname === '/es' || pathname === '/en') {
    return
  }

  // Para la ruta raíz, redirigir a /es
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/es', request.url))
  }

  // Para cualquier otra ruta sin locale, añadir /es por defecto
  const newUrl = new URL(`/es${pathname}`, request.url)
  return NextResponse.redirect(newUrl)
}

export const config = {
  matcher: [
    /*
     * Excluir:
     * - Archivos estáticos
     * - API routes
     * - _next (rutas internas de Next.js)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}