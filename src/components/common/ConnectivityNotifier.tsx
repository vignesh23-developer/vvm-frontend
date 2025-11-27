'use client'

import { useEffect, useRef } from 'react'
import { toast } from 'react-hot-toast'
import { useConnectivity } from '@/hooks/CustomHooks/useConnectivity'

const bannerBaseClasses =
  'rounded-2xl border border-[#b77b33]/30 bg-[#fff7eb] px-5 py-4 shadow-xl flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-left text-[#5f3a14]'

export default function ConnectivityNotifier() {
  const { isOnline, pendingActions, flushQueue } = useConnectivity()
  const previousStatus = useRef(isOnline)

  useEffect(() => {
    if (previousStatus.current === isOnline) {
      return
    }

    if (isOnline) {
      toast.success('Back online! Syncing your latest changes…', { id: 'connectivity-status' })
    } else {
      toast.error('Connection lost. We will retry when you are back online.', { id: 'connectivity-status' })
    }

    previousStatus.current = isOnline
  }, [isOnline])

  if (isOnline) {
    return null
  }

  return (
    <div className="fixed right-5 top-5 z-[60] w-full max-w-sm px-4">
      <div className={bannerBaseClasses}>
        <div>
          <p className="font-semibold text-[#8b5e34]">Looks like you are offline</p>
          <p className="text-sm text-[#6f421a]">We are holding your latest actions and will sync them as soon as you reconnect.</p>
          {pendingActions > 0 && <p className="mt-1 text-xs text-[#7b5022]">Pending actions: {pendingActions}</p>}
        </div>
        <button
          type="button"
          onClick={() => flushQueue()}
          className="rounded-xl bg-[#8b5e34] px-4 py-2 text-sm font-semibold text-white shadow hover:bg-[#a47142]"
        >
          Retry now
        </button>
      </div>
    </div>
  )
}
