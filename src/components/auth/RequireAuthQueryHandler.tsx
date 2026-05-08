'use client'

import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/AuthContext/AuthContextProvider'
import { useLoginModal } from '@/components/auth/LoginModalProvider'

/**
 * Reads `?requireAuth=1&next=/path` (from middleware) and opens the login modal on `/`,
 * or sends an already-authenticated user to `next` and clears the query.
 */
export default function RequireAuthQueryHandler() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { token, loading } = useAuth()
  const { openLoginModal } = useLoginModal()

  useEffect(() => {
    if (loading) return

    const requireAuth = searchParams.get('requireAuth')
    const nextRaw = searchParams.get('next')
    const safeNext = nextRaw && nextRaw.startsWith('/') ? nextRaw : '/'

    if (requireAuth !== '1') {
      return
    }

    if (token) {
      router.replace(safeNext)
      return
    }

    openLoginModal({ next: safeNext })
    router.replace('/')
  }, [loading, token, searchParams, router, openLoginModal])

  return null
}
