'use client'

import { Loader2 } from 'lucide-react'

export default function Loader({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
      <Loader2 className="h-10 w-10 animate-spin text-[#7B1E1E]" />
      <p className="mt-3 text-gray-700 font-medium">{text}</p>
    </div>
  )
}
