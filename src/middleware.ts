import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getUserRoles, hasRole, Roles } from './utils/roles/roles'

const TOKEN_COOKIE = 'authToken'
const USER_COOKIE = 'userData'

const safeJsonParse = <T>(value: string | undefined, fallback: T): T => {
  if (!value) return fallback
  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const rawToken = request.cookies.get(TOKEN_COOKIE)?.value
  // `authToken` is stored via JSON.stringify in server actions, so it can be
  // a JSON string ("token"), or the literal JSON `null` ("null").
  // Treat null/empty as unauthenticated to avoid redirect loops.
  const token = safeJsonParse<string | null>(rawToken, rawToken ?? null)
  const hasToken = typeof token === 'string' && token.trim().length > 0
  const userRaw = request.cookies.get(USER_COOKIE)?.value

  // If already logged in, don't allow access to auth pages
  if (
    hasToken &&
    (pathname === '/otp-verification' ||
      pathname === '/login' ||
      pathname === '/signup' ||
      pathname === '/forgot-password' ||
      pathname === '/profile-creation')
  ) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Admin-only: restrict Ads create/edit pages
  if (pathname === '/ads' || pathname.startsWith('/ads/edit/')) {
    if (!hasToken) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('next', pathname)
      return NextResponse.redirect(url)
    }

    const user = safeJsonParse<Record<string, unknown> | null>(userRaw, null)
    const userRoles = getUserRoles(user)
    const isAdmin = hasRole(userRoles, [Roles.ADMIN])

    if (!isAdmin) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/otp-verification', '/login', '/signup', '/forgot-password', '/profile-creation', '/ads', '/ads/edit/:path*'],
}
