'use client'

import { Suspense, type ReactNode } from 'react'
import { LoginModalProvider } from '@/components/auth/LoginModalProvider'
import RequireAuthQueryHandler from '@/components/auth/RequireAuthQueryHandler'

export default function AuthShell({ children }: { children: ReactNode }) {
  return (
    <LoginModalProvider>
      <Suspense fallback={null}>
        <RequireAuthQueryHandler />
      </Suspense>
      {children}
    </LoginModalProvider>
  )
}
