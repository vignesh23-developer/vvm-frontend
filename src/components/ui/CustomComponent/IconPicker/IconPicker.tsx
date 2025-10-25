'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import * as Icons from 'lucide-react'
import IconGrid from './IconGrid'

interface IconPickerProps {
  value?: string
  onChange: (iconName: string) => void
}

export default function IconPicker({ value, onChange }: IconPickerProps) {
  const [open, setOpen] = useState(false)

  // ✅ Ensure only valid icon name is used
  const SelectedIcon =
    value && (Icons as Record<string, any>)[value]
      ? (Icons as Record<string, any>)[value]
      : ChevronDown

  return (
    <div className="relative inline-block">
      {/* Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl border border-gray-300 hover:bg-gray-200 transition"
      >
        <SelectedIcon size={20} />
        <span className="text-sm text-gray-700 truncate max-w-[100px]">
          {value || 'Select Icon'}
        </span>
        <ChevronDown
          size={18}
          className={`ml-1 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-2 max-h-64 overflow-y-auto">
          <IconGrid
            onSelect={iconName => {
              onChange(iconName)
              setOpen(false)
            }}
            selected={value}
          />
        </div>
      )}
    </div>
  )
}
