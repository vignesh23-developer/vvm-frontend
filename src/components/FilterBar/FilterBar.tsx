'use client'

import { ChevronDown, SortAsc } from 'lucide-react'

interface FiltersBarProps {
  params: string
}

export default function FiltersBar({ params }: FiltersBarProps) {
  return (
    <>
      <div className="w-full bg-white shadow-sm">
        <div className="flex items-center justify-between px-6">
          {/* Left Tabs */}
          {params === 'explore_by_category' ? (
            <div className="flex space-x-4">
              <button className="relative py-3 px-4 rounded-t-md border-b-2 border-yellow-500 text-black font-medium">
                Properties
              </button>
              <button className="py-3 px-4 rounded-t-md text-gray-700 hover:text-black hover:border-b-2 hover:border-yellow-500 transition">
                New Projects
              </button>
              <button className="py-3 px-4 rounded-t-md text-gray-700 hover:text-black hover:border-b-2 hover:border-yellow-500 transition">
                Top Agents
              </button>
            </div>
          ) : (
            <div className="flex space-x-4">
              {/* City Dropdown */}
              <button className="flex items-center space-x-1 py-3 px-4 rounded-t-md border-b-2 border-yellow-500 text-black font-medium">
                <span>Bangalore</span>
                <ChevronDown size={16} />
              </button>

              {/* Localities Dropdown */}
              <button className="flex items-center space-x-1 py-3 px-4 rounded-t-md text-gray-400 hover:text-black hover:border-b-2 hover:border-yellow-500 transition">
                <span>All Localities</span>
                <ChevronDown size={16} />
              </button>
            </div>
          )}

          {/* Right Filters */}
          <div className="flex items-center space-x-4">
            {/* Location Dropdown */}
            {params === 'explore_by_category' && (
              <button className="flex items-center space-x-1 py-3 px-4 rounded-t-md text-gray-700 hover:text-black hover:border-b-2 hover:border-yellow-500 transition">
                <span>Chennai, central</span>
                <ChevronDown size={16} />
              </button>
            )}

            {/* Sort Dropdown */}
            <button className="flex items-center space-x-1 py-3 px-4 rounded-t-md text-gray-700 hover:text-black hover:border-b-2 hover:border-yellow-500 transition">
              <SortAsc size={16} />
              <span>Sort By : Relevance</span>
              <ChevronDown size={16} />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
