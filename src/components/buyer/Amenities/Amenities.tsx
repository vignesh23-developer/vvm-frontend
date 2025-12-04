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
        <div className="space-y-6">
          {Object.entries(grouped).map(([groupName, categories]) => (
            <section key={groupName} className="py-4 pr-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">{groupName}</h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {Object.entries(categories).map(([categoryName, options]) => (
                  <div key={categoryName} className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">{categoryName}</h4>

                    <div className="flex flex-wrap gap-2">
                      {options.map((opt, idx) => (
                        <div
                          key={`${opt.name}-${idx}`}
                          className="flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 hover:bg-gray-100 px-3 py-2 transition"
                        >
                          {opt.icon && <LucideIconRenderer iconName={opt.icon as any} size={16} color="#D4AF37" />}
                          <span className="text-sm text-gray-700 font-medium">{opt.name}</span>
                        </div>
                      ))}
                    </div>
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
    const inputType = f?.feature_category?.input_type ?? f?.input_type
    if (!['single_select', 'multi_select', 'text', 'numeric', 'boolean', 'units'].includes(inputType)) continue

    const groupName = f?.feature_group?.name ?? 'Other'
    const categoryName = f?.feature_category?.name ?? 'General'

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
