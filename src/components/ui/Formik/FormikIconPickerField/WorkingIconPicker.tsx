'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Search, ChevronDown } from 'lucide-react'
import { LucideIconName } from './LucideIconName'
import { SimpleIconLoader } from './SimpleIconLoader'

interface SimpleIconPickerProps {
  value: LucideIconName | null
  onChange: (icon: LucideIconName) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export default function SimpleIconPicker({
  value,
  onChange,
  placeholder = 'Select an icon',
  disabled = false,
  className = '',
}: SimpleIconPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [icons, setIcons] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [justSelected, setJustSelected] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Load icons on mount
  useEffect(() => {
    const loadIcons = async () => {
      console.log('🔄 SimpleIconPicker: Loading icons...')
      const loader = SimpleIconLoader.getInstance()
      const result = await loader.loadIcons()

      if (result.isLoaded) {
        setIcons(result.icons)
        console.log('SimpleIconPicker: Loaded', result.icons.length, 'icons')
      } else {
        console.error('SimpleIconPicker: Failed to load icons:', result.error)
      }

      setIsLoading(false)
    }

    loadIcons()
  }, [])

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Filter icons based on search
  const filteredIcons = icons.filter(icon => icon.name.toLowerCase().includes(search.toLowerCase()))
  console.log('🔍 SimpleIconPicker: Filtered icons count:', filteredIcons)

  // Find selected icon
  const selectedIcon = value ? icons.find(icon => icon.name === value) : null
  console.log('🔍 SimpleIconPicker: Selected icon:', selectedIcon)

  const handleSelect = (iconName: LucideIconName) => {
    onChange(iconName)
    setIsOpen(false)
    setSearch('')

    // Show selection feedback
    setJustSelected(true)
    setTimeout(() => setJustSelected(false), 500)
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full p-3 border rounded-md bg-gray-100 text-left transition-all duration-200
          flex items-center justify-between min-h-[48px]
          ${disabled ? 'cursor-not-allowed text-gray-400' : 'hover:bg-gray-200 cursor-pointer'}
          ${isOpen ? 'ring-2 ring-gray-300' : ''}
          ${justSelected ? 'ring-2 ring-green-300' : ''}
          ${className}
        `}
      >
        <div className="flex items-center gap-3">
          {selectedIcon ? (
            <>
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-200 rounded-md">
                <selectedIcon.component className="h-5 w-5 text-gray-700" />
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-gray-900">{selectedIcon.name}</span>
                <span className="text-xs text-gray-600">Lucide Icon</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-200 rounded-md">
                <Search className="h-4 w-4 text-gray-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-gray-600">{placeholder}</span>
                <span className="text-xs text-gray-500">Choose an icon</span>
              </div>
            </>
          )}
        </div>
        <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180 text-gray-700' : ''}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-96 overflow-hidden min-w-[400px] w-max">
          {/* Search */}
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search icons..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-500 bg-white text-sm"
                autoFocus
              />
            </div>
          </div>

          {/* Icons Grid */}
          <div className="p-4 max-h-80 overflow-y-auto">
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500 mx-auto mb-3"></div>
                <p className="text-sm">Loading icons...</p>
              </div>
            ) : filteredIcons.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Search className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm font-medium">No icons found</p>
                <p className="text-xs">Try a different search term</p>
              </div>
            ) : (
              <div className="grid grid-cols-6 gap-2">
                {filteredIcons.map(({ name, component: IconComponent }) => (
                  <button
                    key={name}
                    onClick={() => handleSelect(name)}
                    className={`
                      p-3 rounded-lg border-2 transition-all duration-200 group
                      flex flex-col items-center gap-1 min-h-[70px]
                      ${
                        value === name
                          ? 'border-gray-600 bg-gray-100 text-gray-800 shadow-sm'
                          : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50 hover:text-gray-700 hover:shadow-sm'
                      }
                    `}
                    title={name}
                  >
                    <IconComponent className="h-5 w-5 flex-shrink-0" />
                    <span className="text-xs font-medium truncate w-full text-center leading-tight">{name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>
                {filteredIcons.length} of {icons.length} icons
              </span>
              <span>Powered by Lucide</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
