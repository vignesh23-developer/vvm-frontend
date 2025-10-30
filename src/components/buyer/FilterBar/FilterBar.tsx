'use client'

import { ChevronDown, SortAsc } from 'lucide-react'

interface FiltersBarProps {
  params: string
  language?: any
}

const baseBtn =
  'py-2 px-4 mt-2 sm:mt-4 rounded-md text-sm font-medium bg-white border-b-4 border-b-yellow-500 flex items-center gap-1 transition'
const activeText = 'text-black'
const inactiveText = 'text-gray-500 hover:text-black'

export default function FiltersBar({ params, language }: FiltersBarProps) {
  const categoryTabs = ['Properties', 'New Projects', 'Top Agents']

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-6">
        {/* Left Section */}
        {params === 'explore_by_category' ? (
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {categoryTabs.map(tab => (
              <button key={tab} className={`${baseBtn} ${activeText}`}>
                {tab}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {/* City Dropdown */}
            <button className={`${baseBtn} ${activeText}`}>
              <span>Bangalore</span>
              <ChevronDown size={16} />
            </button>

            {/* Localities Dropdown */}
            <button className={`${baseBtn} ${inactiveText}`}>
              <span>{language('PropertiesFilter.all_localities')}</span>
              <ChevronDown size={16} />
            </button>
          </div>
        )}

        {/* Right Section */}
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {params === 'explore_by_category' && (
            <button className={`${baseBtn} ${inactiveText}`}>
              <span>Chennai, central</span>
              <ChevronDown size={16} />
            </button>
          )}
          <button className={`${baseBtn} ${inactiveText}`}>
            <SortAsc size={16} />
            <span className="whitespace-nowrap">
              {language('PropertiesFilter.sort_by')} :{' '}
              {language('PropertiesFilter.relevance')}
            </span>
            <ChevronDown size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
