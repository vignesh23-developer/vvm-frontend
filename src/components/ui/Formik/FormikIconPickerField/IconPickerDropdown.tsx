'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Search, X, ChevronDown, Loader2 } from 'lucide-react'
import { LucideIconName } from './LucideIconName'
import { IconLoader, IconInfo } from './IconLoader'

export interface IconPickerDropdownProps {
  value: LucideIconName | null
  onChange: (icon: LucideIconName) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  maxHeight?: string
}

export default function IconPickerDropdown({
  value,
  onChange,
  placeholder = 'Select an icon',
  disabled = false,
  className = '',
  maxHeight = '320px',
}: IconPickerDropdownProps) {
  // State management
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [icons, setIcons] = useState<IconInfo[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [categories, setCategories] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [selectedIcon, setSelectedIcon] = useState<any>(null)

  // Refs
  const containerRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Icon loader instance
  const iconLoader = IconLoader.getInstance()

  // Load icons on mount
  useEffect(() => {
    const loadIcons = async () => {
      setIsLoading(true)
      console.log('🔄 IconPickerDropdown: Starting to load icons...')
      const result = await iconLoader.loadIcons()

      console.log('📊 IconPickerDropdown: Load result:', {
        isLoaded: result.isLoaded,
        iconCount: result.icons.length,
        error: result.error,
      })

      if (result.error) {
        setError(result.error)
        console.error(' IconPickerDropdown: Error loading icons:', result.error)
      } else {
        setIcons(result.icons)
        setError(null)
        console.log(' IconPickerDropdown: Successfully loaded', result.icons.length, 'icons')
      }

      setIsLoading(false)
    }

    loadIcons()
  }, [iconLoader])

  // Update selected icon when value changes
  useEffect(() => {
    if (value && !isLoading) {
      const icon = iconLoader.getIcon(value)
      setSelectedIcon(icon)
    } else {
      setSelectedIcon(null)
    }
  }, [value, iconLoader, isLoading])

  // Filter icons based on search
  const filteredIcons = useCallback(() => {
    if (!search.trim()) {
      return icons
    }
    return iconLoader.searchIcons(search)
  }, [search, icons, iconLoader])

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      // Focus search input when opened
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 0)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Handle icon selection
  const handleIconSelect = useCallback(
    (iconName: LucideIconName) => {
      onChange(iconName)
      setIsOpen(false)
      setSearch('')
    },
    [onChange],
  )

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      } else if (event.key === 'Enter' && !isOpen) {
        setIsOpen(true)
      }
    },
    [isOpen],
  )

  // Clear search
  const clearSearch = useCallback(() => {
    setSearch('')
    searchInputRef.current?.focus()
  }, [])

  // Render loading state
  if (isLoading) {
    return (
      <div className={`relative ${className}`}>
        <div className="flex items-center justify-between w-full p-2 border rounded-md bg-gray-50">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
            <span className="text-gray-500">Loading icons...</span>
          </div>
        </div>
      </div>
    )
  }

  // Render error state
  if (error) {
    return (
      <div className={`relative ${className}`}>
        <div className="flex items-center justify-between w-full p-2 border rounded-md bg-red-50 border-red-200">
          <span className="text-red-600 text-sm">Failed to load icons</span>
        </div>
      </div>
    )
  }

  const iconsToShow = filteredIcons()

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Main trigger button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={`flex items-center justify-between w-full p-2 border rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-gray-50'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {value && selectedIcon ? (
            <>
              {React.createElement(selectedIcon, { className: 'h-5 w-5 flex-shrink-0' })}
              <span className="truncate">{value}</span>
            </>
          ) : (
            <span className="text-gray-500 truncate">{placeholder}</span>
          )}
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border rounded-md shadow-lg overflow-hidden" style={{ maxHeight }}>
          {/* Search header */}
          <div className="p-3 border-b bg-gray-50">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search icons..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-8 pr-8 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {search && (
                <button type="button" onClick={clearSearch} className="absolute right-2 top-2.5 p-0.5 hover:bg-gray-200 rounded">
                  <X className="h-3 w-3 text-gray-500" />
                </button>
              )}
            </div>
          </div>

          {/* Icons grid */}
          <div className="overflow-y-auto" style={{ maxHeight: '240px' }}>
            {iconsToShow.length > 0 ? (
              <div className="grid grid-cols-6 gap-1 p-2">
                {iconsToShow.map(({ name, component: IconComponent }) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => handleIconSelect(name)}
                    className={`p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 flex flex-col items-center justify-center text-xs transition-colors ${
                      value === name ? 'bg-blue-100 ring-2 ring-blue-200' : ''
                    }`}
                    title={name}
                  >
                    <IconComponent className="h-5 w-5 mb-1" />
                    <span className="truncate w-full text-center text-xs">{name}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">{search ? `No icons found for "${search}"` : 'No icons available'}</p>
              </div>
            )}
          </div>

          {/* Footer with icon count */}
          <div className="p-2 border-t bg-gray-50 text-xs text-gray-500 text-center">
            {search ? `${iconsToShow.length} of ${icons.length}` : `${icons.length} icons available`}
          </div>
        </div>
      )}
    </div>
  )
}
