'use client'

import { useState } from 'react'
import { ChevronDown, SortAsc } from 'lucide-react'

interface FiltersBarProps {
  params: string
  language?: any
}

const baseBtn = 'py-2 px-4 mt-2 sm:mt-4 rounded-md text-sm font-medium bg-white border-b-4 flex items-center gap-1 transition'
const activeStyles = 'text-black border-b-yellow-500'
const inactiveStyles = 'text-gray-500 border-b-transparent hover:text-black hover:border-b-yellow-400'

export default function FiltersBar({ params, language }: FiltersBarProps) {
  const categoryTabs = ['Properties', 'New Projects', 'Top Agents']
  const translate = language ?? ((key: string) => key)
  const [activeCategory, setActiveCategory] = useState(categoryTabs[0])
  const [selectedRegion, setSelectedRegion] = useState('Chennai, central')
  const [selectedSortKey, setSelectedSortKey] = useState<'relevance' | 'price_low_to_high' | 'price_high_to_low'>('relevance')
  const [isRegionOpen, setIsRegionOpen] = useState(false)
  const [isSortOpen, setIsSortOpen] = useState(false)

  const regionOptions = ['Chennai, central', 'Chennai, north', 'Chennai, south', 'Bangalore']
  const sortOptions: Array<{ key: 'relevance' | 'price_low_to_high' | 'price_high_to_low'; label: string }> = [
    { key: 'relevance', label: translate('PropertiesFilter.relevance') },
    { key: 'price_low_to_high', label: translate('PropertiesFilter.price_low_to_high') },
    { key: 'price_high_to_low', label: translate('PropertiesFilter.price_high_to_low') },
  ]

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-6">
        {/* Left Section */}
        {params === 'explore_by_category' ? (
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {categoryTabs.map(tab => {
              const isActive = activeCategory === tab
              return (
                <button
                  key={tab}
                  type="button"
                  className={`${baseBtn} ${isActive ? activeStyles : inactiveStyles}`}
                  aria-pressed={isActive}
                  onClick={() => setActiveCategory(tab)}
                >
                  {tab}
                </button>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {/* City Dropdown */}
            <button className={`${baseBtn} ${activeStyles}`} type="button">
              <span>Bangalore</span>
              <ChevronDown size={16} />
            </button>

            {/* Localities Dropdown */}
            <button className={`${baseBtn} ${inactiveStyles}`} type="button">
              <span>{translate('PropertiesFilter.all_localities')}</span>
              <ChevronDown size={16} />
            </button>
          </div>
        )}

        {/* Right Section */}
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {params === 'explore_by_category' && (
            <div className="relative">
              <button
                type="button"
                className={`${baseBtn} ${isRegionOpen ? activeStyles : inactiveStyles}`}
                aria-expanded={isRegionOpen}
                onClick={() => setIsRegionOpen(prev => !prev)}
              >
                <span>{selectedRegion}</span>
                <ChevronDown size={16} />
              </button>
              {isRegionOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-100 z-20">
                  {regionOptions.map(option => (
                    <button
                      key={option}
                      type="button"
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                        option === selectedRegion ? 'text-black font-medium' : 'text-gray-600'
                      }`}
                      onClick={() => {
                        setSelectedRegion(option)
                        setIsRegionOpen(false)
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="relative">
            <button
              type="button"
              className={`${baseBtn} ${isSortOpen ? activeStyles : inactiveStyles}`}
              aria-expanded={isSortOpen}
              onClick={() => setIsSortOpen(prev => !prev)}
            >
              <SortAsc size={16} />
              <span className="whitespace-nowrap">
                {translate('PropertiesFilter.sort_by')} : {sortOptions.find(option => option.key === selectedSortKey)?.label}
              </span>
              <ChevronDown size={16} />
            </button>
            {isSortOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-lg border border-gray-100 z-20">
                {sortOptions.map(option => (
                  <button
                    key={option.key}
                    type="button"
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                      option.key === selectedSortKey ? 'text-black font-medium' : 'text-gray-600'
                    }`}
                    onClick={() => {
                      setSelectedSortKey(option.key)
                      setIsSortOpen(false)
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
