import { useCallback, useEffect, useRef, useState } from 'react'

type OfflineAction = () => Promise<unknown> | unknown

type ConnectivityOptions = {
  onStatusChange?: (isOnline: boolean) => void
}

const getInitialStatus = () => {
  if (typeof navigator === 'undefined') {
    return true
  }
  return navigator.onLine
}

export const useConnectivity = (options?: ConnectivityOptions) => {
  const [isOnline, setIsOnline] = useState<boolean>(getInitialStatus)
  const [lastChangedAt, setLastChangedAt] = useState<number>(() => Date.now())
  const [pendingActions, setPendingActions] = useState(0)

  const actionQueue = useRef<OfflineAction[]>([])
  const onStatusChange = options?.onStatusChange

  const flushQueue = useCallback(async () => {
    if (!actionQueue.current.length) {
      return
    }

    const queuedActions = [...actionQueue.current]
    actionQueue.current = []
    setPendingActions(0)

    for (const action of queuedActions) {
      try {
        await action()
      } catch (error) {
        console.error('Queued offline action failed after reconnection', error)
      }
    }
  }, [])

  const enqueueAction = useCallback((action: OfflineAction) => {
    actionQueue.current.push(action)
    setPendingActions(actionQueue.current.length)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const handleStatusChange = (status: boolean) => {
      setIsOnline(status)
      setLastChangedAt(Date.now())
      onStatusChange?.(status)
      if (status) {
        flushQueue()
      }
    }

    const handleOnline = () => handleStatusChange(true)
    const handleOffline = () => handleStatusChange(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [flushQueue, onStatusChange])

  return {
    isOnline,
    lastChangedAt,
    enqueueAction,
    flushQueue,
    pendingActions,
  }
}
