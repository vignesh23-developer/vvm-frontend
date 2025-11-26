'use client'

import React, { createContext, useContext, useState, useMemo, useCallback } from 'react'

type GLobalContextValue = {
  value: string | null
  loading: boolean
  setValue: (next: string | null) => void
  reset: () => void
}

const GlobalContext = createContext<GLobalContextValue | undefined>(undefined)

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [value, setValueState] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const setValue = useCallback((next: string | null) => {
    setValueState(next)
  }, [])

  const reset = useCallback(() => {
    setValueState(null)
  }, [])

  const contextValue = useMemo(() => ({ value, loading, setValue, reset }), [value, loading, setValue, reset])

  return <GlobalContext.Provider value={contextValue}>{children}</GlobalContext.Provider>
}

export const useGlobalContext = () => {
  const ctx = useContext(GlobalContext)
  if (!ctx) throw new Error('useGlobalContext must be used within GlobalProvider')
  return ctx
}
