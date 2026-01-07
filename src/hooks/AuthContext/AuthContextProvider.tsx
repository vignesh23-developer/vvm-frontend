'use client'

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo, ReactNode } from 'react'
import { onGetCookies, onSetCookies, onDeleteCookies } from '@/utils/cookies/cookiesHelper'

type User = Record<string, any> | null

interface AuthContextType {
  user: User
  token: string | null
  loading: boolean
  setUser: (data: User) => Promise<void>
  setToken: (token: string | null) => Promise<void>
  refreshAuth: () => Promise<void>
  logout: () => Promise<void>
}

const USER_COOKIE = 'userData'
const TOKEN_COOKIE = 'authToken'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
  initialUser?: User
  initialToken?: string | null
}

// -----------------------------
// Helpers
// -----------------------------
const parseJSON = <T,>(value: any, fallback: T): T => {
  if (!value) return fallback
  if (typeof value === 'string') {
    try {
      return JSON.parse(value)
    } catch {
      return fallback
    }
  }
  return (value as T) ?? fallback
}

const normalizeToken = (value: unknown): string | null => {
  const parsed = parseJSON<string | null>(value, value as any)
  if (typeof parsed !== 'string') return null
  const trimmed = parsed.trim()
  return trimmed.length > 0 ? trimmed : null
}

// -----------------------------
// Provider
// -----------------------------
export const AuthProvider = ({ children, initialUser, initialToken }: AuthProviderProps) => {
  const shouldHydrateFromCookies = initialUser === undefined && initialToken === undefined

  const [user, setUserState] = useState<User>(initialUser ?? null)
  const [token, setTokenState] = useState<string | null>(initialToken ?? null)
  const [loading, setLoading] = useState(shouldHydrateFromCookies)

  // Load from cookies
  const refreshAuth = useCallback(async () => {
    const [userRes, tokenRes] = await Promise.all([onGetCookies(USER_COOKIE), onGetCookies(TOKEN_COOKIE)])

    setUserState(parseJSON(userRes.cookies, null))
    setTokenState(normalizeToken(tokenRes.cookies))
  }, [])

  // Initial load
  useEffect(() => {
    if (!shouldHydrateFromCookies) {
      setLoading(false)
      return
    }

    refreshAuth().finally(() => setLoading(false))
  }, [refreshAuth, shouldHydrateFromCookies])

  // Save user
  const setUser = useCallback(async (data: User) => {
    data ? await onSetCookies(USER_COOKIE, data) : await onDeleteCookies(USER_COOKIE)
    setUserState(data)
  }, [])

  // Save token
  const setToken = useCallback(async (value: string | null) => {
    value ? await onSetCookies(TOKEN_COOKIE, value) : await onDeleteCookies(TOKEN_COOKIE)
    setTokenState(value)
  }, [])

  // Logout
  const logout = useCallback(async () => {
    await Promise.all([onDeleteCookies(USER_COOKIE), onDeleteCookies(TOKEN_COOKIE)])
    setUserState(null)
    setTokenState(null)
  }, [])

  // Memo value
  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      setUser,
      setToken,
      refreshAuth,
      logout,
    }),
    [user, token, loading, setUser, setToken, refreshAuth, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook
export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

export default AuthProvider
