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
        className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border border-dashed border-rose-200 bg-white shadow-inner transition duration-200 hover:border-rose-400 hover:shadow-lg"
      >
        {logoUrl ? (
          <Image src={logoUrl} alt={label} width={size} height={size} className="h-full w-full rounded-full object-cover" />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-[#3e2a1c]">
            <Camera className="h-6 w-6" />
            <span className="text-xs font-semibold">{title}</span>
          </div>
        )}

        <span className="absolute bottom-2 rounded-full bg-red-400 px-3 py-1 text-xs font-medium text-white shadow-md">{changeText}</span>
      </button>

      <div className="text-center text-sm text-[#3e2a1c]">
        <p className="font-medium">{label}</p>
      </div>
    </div>
  )
}
