// middleware.ts
import { getLocalStorageItem } from '@/utils/local_storage/local_storage_handler'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = getLocalStorageItem('authToken')

  // Redirect root path `/` depending on login
  if (request.nextUrl.pathname === '/') {
    const redirectUrl = new URL(token ? '/' : '/login', request.url)
    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/'], // apply middleware to `/`
}
