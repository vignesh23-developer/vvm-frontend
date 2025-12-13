'use client'

import Image from 'next/image'
import { Camera } from 'lucide-react'

interface LogoOrProfileImageUploadProps {
  logoUrl?: string
  onClick: () => void
  label?: string
  title?: string
  changeText?: string
  size?: number // default 110
}

export default function LogoOrProfileImageUpload({
  logoUrl,
  onClick,
  label = 'Company Logo',
  title = 'Upload Logo',
  changeText = 'Change',
  size = 110,
}: LogoOrProfileImageUploadProps) {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-3 p-6">
      <button
        type="button"
        onClick={onClick}
        className={`relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full transition duration-300 shadow-md hover:shadow-xl group ${logoUrl ? 'border-2 border-white ring-2 ring-gray-100' : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
          }`}
      >
        {logoUrl ? (
          <>
            <Image src={logoUrl} alt={label} fill className="object-cover" />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium">
              {changeText}
            </div>
          </>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" x2="12" y1="3" y2="15" />
            </svg>
            <span className="text-[10px] font-semibold uppercase tracking-wide">{title}</span>
          </div>
        )}

        {!logoUrl && (
          <span className="absolute bottom-2 rounded-full bg-[#2a1407] px-3 py-1 text-[10px] font-bold text-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
            {changeText}
          </span>
        )}
      </button>

      <div className="text-center text-sm text-[#3e2a1c]">
        <p className="font-medium">{label}</p>
      </div>
    </div>
  )
}
