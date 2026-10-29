'use client'

import { useState } from 'react'
import { ChevronDown, SortAsc } from 'lucide-react'

interface FiltersBarProps {
  params: string
  language?: (key: string) => string
}

type SortKey = 'relevance' | 'price_low_to_high' | 'price_high_to_low'

const CATEGORY_TABS = ['Properties', 'New Projects', 'Top Agents']

const REGION_OPTIONS = [
  'Chennai, central',
  'Chennai, north',
  'Chennai, south',
  'Bangalore',
]

const SORT_KEYS: SortKey[] = [
  'relevance',
  'price_low_to_high',
  'price_high_to_low',
]

const BASE_BUTTON =
  'py-2 px-4 mt-2 sm:mt-4 rounded-md text-sm font-medium bg-white border-b-4 flex items-center gap-1 transition'

const ACTIVE_STYLES = 'text-black border-b-yellow-500'

const INACTIVE_STYLES =
  'text-gray-500 border-b-transparent hover:text-black hover:border-b-yellow-400'

const DROPDOWN_CONTAINER =
  'absolute right-0 mt-2 bg-white shadow-lg rounded-lg border border-gray-100 z-20'

const DROPDOWN_OPTION =
  'block w-full text-left px-4 py-2 text-sm hover:bg-gray-100'

export default function FiltersBar({
  params,
  language,
}: FiltersBarProps) {
  const translate = language ?? ((key: string) => key)

  const [activeCategory, setActiveCategory] = useState(CATEGORY_TABS[0])
  const [selectedRegion, setSelectedRegion] = useState('Chennai, central')
  const [selectedSortKey, setSelectedSortKey] =
    useState<SortKey>('relevance')
  const [isRegionOpen, setIsRegionOpen] = useState(false)
  const [isSortOpen, setIsSortOpen] = useState(false)

  const isExploreByCategory = params === 'explore_by_category'

  const sortOptions = SORT_KEYS.map(key => ({
    key,
    label: translate(`PropertiesFilter.${key}`),
  }))

  const selectedSortLabel = sortOptions.find(
    option => option.key === selectedSortKey,
  )?.label

  const getButtonStyles = (isActive: boolean) =>
    `${BASE_BUTTON} ${isActive ? ACTIVE_STYLES : INACTIVE_STYLES}`

  const getOptionStyles = (isSelected: boolean) =>
    `${DROPDOWN_OPTION} ${
      isSelected ? 'text-black font-medium' : 'text-gray-600'
    }`

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-6">
        {/* Left Section */}
        {isExploreByCategory ? (
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {CATEGORY_TABS.map(tab => {
              const isActive = activeCategory === tab

              return (
                <button
                  key={tab}
                  type="button"
                  className={getButtonStyles(isActive)}
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
            <button
              className={getButtonStyles(true)}
              type="button"
            >
              <span>Bangalore</span>
              <ChevronDown size={16} />
            </button>

            {/* Localities Dropdown */}
            <button
              className={getButtonStyles(false)}
              type="button"
            >
              <span>{translate('PropertiesFilter.all_localities')}</span>
              <ChevronDown size={16} />
            </button>
          </div>
        )}

        {/* Right Section */}
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {isExploreByCategory && (
            <div className="relative">
              <button
                type="button"
                className={getButtonStyles(isRegionOpen)}
                aria-expanded={isRegionOpen}
                onClick={() => setIsRegionOpen(prev => !prev)}
              >
                <span>{selectedRegion}</span>
                <ChevronDown size={16} />
              </button>

              {isRegionOpen && (
                <div className={`${DROPDOWN_CONTAINER} w-48`}>
                  {REGION_OPTIONS.map(option => (
                    <button
                      key={option}
                      type="button"
                      className={getOptionStyles(option === selectedRegion)}
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
              className={getButtonStyles(isSortOpen)}
              aria-expanded={isSortOpen}
              onClick={() => setIsSortOpen(prev => !prev)}
            >
              <SortAsc size={16} />

              <span className="whitespace-nowrap">
                {translate('PropertiesFilter.sort_by')} : {selectedSortLabel}
              </span>

              <ChevronDown size={16} />
            </button>

            {isSortOpen && (
              <div className={`${DROPDOWN_CONTAINER} w-56`}>
                {sortOptions.map(option => (
                  <button
                    key={option.key}
                    type="button"
                    className={getOptionStyles(
                      option.key === selectedSortKey,
                    )}
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

