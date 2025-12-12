'use client'

import React, { useMemo } from 'react'
import LucideIconRenderer from '@/components/ui/CustomComponent/LucideIconRenderer/LucideIconRenderer'

interface AmenitiesProps {
  title: string
  PropertyAmenities?: any[]
}

const Amenities: React.FC<AmenitiesProps> = ({ title, PropertyAmenities = [] }) => {
  const grouped = useMemo(() => extractGroupedAmenities(PropertyAmenities), [PropertyAmenities])
  const hasData = Object.keys(grouped).length > 0

  return (
    <div className="w-full">
      {!hasData ? (
        <p className="text-gray-500 italic text-sm mt-4">No amenities available.</p>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([groupName, categories]) => (
            <section key={groupName} className="py-2">
              <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-2">
                <h3 className="text-xl font-bold text-[#2a1407]">{groupName}</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-8">
                {Object.entries(categories).map(([categoryName, options]) => (
                  <div key={categoryName} className="flex flex-col">
                    {/* Render logic: Single value vs Multiple values */}
                    {options.length === 1 ? (
                      // Single Value Design (MagicBricks style)
                      <div className="flex flex-col">
                        <h4 className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1 flex items-center gap-2">
                          {categoryName}
                        </h4>
                        <div className="text-base font-bold text-gray-900 flex items-center gap-2">
                          {options[0].icon && <LucideIconRenderer iconName={options[0].icon as any} size={18} className="text-yellow-600" />}
                          <span>{options[0].name}</span>
                        </div>
                      </div>
                    ) : (
                      // Multiple Values Design (Chips)
                      <div className="flex flex-col">
                        <h4 className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-2 flex items-center gap-2">
                          {categoryName}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {options.map((opt, idx) => (
                            <div
                              key={`${opt.name}-${idx}`}
                              className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white hover:bg-yellow-50 px-3 py-1.5 transition shadow-sm"
                            >
                              {opt.icon && <LucideIconRenderer iconName={opt.icon as any} size={14} className="text-yellow-600" />}
                              <span className="text-sm text-gray-700 font-semibold">{opt.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}

export default Amenities

interface AmenityOption {
  name: string
  icon?: string
}

interface GroupedAmenities {
  [groupName: string]: {
    [categoryName: string]: AmenityOption[]
  }
}

const extractGroupedAmenities = (featureValues: any[]): GroupedAmenities => {
  const result: GroupedAmenities = {}

  if (!Array.isArray(featureValues)) return result

  for (const f of featureValues) {
    // Only accept processed input types
    const inputType = f?.feature_category?.input_type ?? f?.input_type

    // Loosen input type check to capture more fields if needed, but keeping safety
    if (!['single_select', 'multi_select', 'text', 'numeric', 'boolean', 'units'].includes(inputType) && !f.values) continue

    const groupName = f?.feature_group?.name || f?.feature_group_name || 'Other'
    const categoryName = f?.feature_category?.name || f?.feature_category_name || 'General'

    result[groupName] ||= {}
    result[groupName][categoryName] ||= []

    if (Array.isArray(f.feature_options) && f.feature_options.length > 0) {
      result[groupName][categoryName].push(
        ...f.feature_options.map((opt: any) => ({
          name: opt.name ?? 'Unnamed',
          icon: opt.icon ?? '',
        })),
      )
    } else if (f.values !== undefined && f.values !== null && f.values !== '') {
      result[groupName][categoryName].push({
        name: String(f.values),
        icon: '',
      })
    }
  }

  return result
}
