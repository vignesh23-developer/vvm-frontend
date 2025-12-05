'use client'

import React, { createContext, useContext, useState, useMemo, useCallback } from 'react'

// Context value — allow any JSON-serializable value for flexibility
type GlobalContextValue = {
  globalValue: any
  loading: boolean
  setGlobalValue: (next: any) => void
  reset: () => void
}

const GlobalContext = createContext<GlobalContextValue | undefined>(undefined)

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [globalValue, setGlobalValueState] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  // Accept any value (string | object | array | null). Keep as simple setter.
  const setGlobalValue = useCallback((next: any) => {
    setGlobalValueState(next)
  }, [])

  const reset = useCallback(() => {
    setGlobalValueState(null)
  }, [])

  const contextValue = useMemo(() => ({ globalValue, loading, setGlobalValue, reset }), [globalValue, loading, setGlobalValue, reset])

  return <GlobalContext.Provider value={contextValue}>{children}</GlobalContext.Provider>
}

export const useGlobalContext = () => {
  const ctx = useContext(GlobalContext)
  if (!ctx) throw new Error('useGlobalContext must be used within GlobalProvider')
  return ctx
}
