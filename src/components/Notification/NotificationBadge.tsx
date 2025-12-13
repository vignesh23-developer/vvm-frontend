'use client'

import { useNotification } from './hooks/useNotification'

export default function NotificationBadge() {
  const { unreadCount } = useNotification({
    autoPoll: true,
    pollInterval: 30000,
    initialLimit: 1, // We only need the count, but API requires at least 1
  })

  if (unreadCount === 0) {
    return null
  }

  return (
    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center min-w-[20px] border-2 border-white">
      {unreadCount > 99 ? '99+' : unreadCount}
    </span>
  )
}

