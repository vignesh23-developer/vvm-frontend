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

function redirectHomeRequireAuth(request: NextRequest, pathname: string, search: string) {
  const home = new URL('/', request.url)
  home.searchParams.set('requireAuth', '1')
  home.searchParams.set('next', `${pathname}${search}`)
  return NextResponse.redirect(home)
}

/** In-app transitions send RSC/prefetch headers; address bar / refresh / new tab typically do not. */
function isNextSoftNavigation(request: NextRequest): boolean {
  const rsc = request.headers.get('RSC') ?? request.headers.get('rsc')
  if (rsc === '1') return true
  if (request.headers.get('Next-Router-Prefetch') === '1') return true
  return false
}

export function middleware(request: NextRequest) {
  const { pathname, host, protocol } = request.nextUrl

  // Force non-www
  if (host.startsWith('www.')) {
    const newHost = host.replace('www.', '')
    return NextResponse.redirect(`${protocol}//${newHost}${pathname}${request.nextUrl.search}`, 301)
  }

  const rawToken = request.cookies.get(TOKEN_COOKIE)?.value
  // `authToken` is stored via JSON.stringify in server actions, so it can be
  // a JSON string ("token"), or the literal JSON `null` ("null").
  // Treat null/empty as unauthenticated to avoid redirect loops.
  const token = safeJsonParse<string | null>(rawToken, rawToken ?? null)
  const hasToken = typeof token === 'string' && token.trim().length > 0
  const userRaw = request.cookies.get(USER_COOKIE)?.value

  // Legacy /login URL: never render the old login page for guests — home + login modal (preserves ?next=)
  if (!hasToken && pathname === '/login') {
    const nextParam = request.nextUrl.searchParams.get('next')
    const safeNext = nextParam && nextParam.startsWith('/') ? nextParam : '/'
    return redirectHomeRequireAuth(request, safeNext, '')
  }

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

  // Authenticated admin routes only (unauthenticated → home + login modal)
  if (!hasToken && (pathname === '/admin' || pathname.startsWith('/admin/'))) {
    return redirectHomeRequireAuth(request, pathname, request.nextUrl.search)
  }

  // Services listing: hard navigation (paste/refresh) → home + login modal; soft nav handled on page + Navbar
  if (!hasToken && pathname === '/ads-list' && !isNextSoftNavigation(request)) {
    return redirectHomeRequireAuth(request, pathname, request.nextUrl.search)
  }

  // Admin-only: restrict Ads create/edit pages
  if (pathname === '/ads' || pathname.startsWith('/ads/edit/')) {
    if (!hasToken) {
      return redirectHomeRequireAuth(request, pathname, request.nextUrl.search)
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
  matcher: [
    '/otp-verification',
    '/login',
    '/signup',
    '/forgot-password',
    '/profile-creation',
    '/ads',
    '/ads/edit/:path*',
    '/admin',
    '/admin/:path*',
    '/ads-list',
  ],
}
