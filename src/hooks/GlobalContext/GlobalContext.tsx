'use client'

import React, { createContext, useContext, useState, useMemo, useCallback } from 'react'

// Context value — allow any JSON-serializable value for flexibility
type GlobalContextValue = {
  value: any
  loading: boolean
  setValue: (next: any) => void
  reset: () => void
}

const GlobalContext = createContext<GlobalContextValue | undefined>(undefined)

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [value, setValueState] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  // Accept any value (string | object | array | null). Keep as simple setter.
  const setValue = useCallback((next: any) => {
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
