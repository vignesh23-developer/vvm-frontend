'use client'

import { Suspense, type ReactNode } from 'react'
import { LoginModalProvider } from '@/components/auth/LoginModalProvider'
import {
  ForgotPasswordModalProvider,
  ForgotPasswordModalOverlayHost,
} from '@/components/auth/ForgotPasswordModalProvider'
import RequireAuthQueryHandler from '@/components/auth/RequireAuthQueryHandler'

export default function AuthShell({ children }: { children: ReactNode }) {
  return (
    <ForgotPasswordModalProvider>
      <LoginModalProvider>
        <ForgotPasswordModalOverlayHost />
        <Suspense fallback={null}>
          <RequireAuthQueryHandler />
        </Suspense>
        {children}
      </LoginModalProvider>
    </ForgotPasswordModalProvider>
  )
}
