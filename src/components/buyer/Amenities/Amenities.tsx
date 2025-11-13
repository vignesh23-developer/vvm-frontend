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
    <div className="w-full max-w-5xl mx-auto p-6 bg-white rounded-2xl shadow border border-gray-200">
      <header className="mb-6 border-b border-gray-200 pb-3">
        <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
        <p className="text-gray-600 text-sm">Available features and amenities</p>
      </header>

      {!hasData ? (
        <p className="text-gray-500 italic text-sm mt-4">No amenities available.</p>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([groupName, categories]) => (
            <section key={groupName} className="rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow transition">
              <h3 className="text-lg font-semibold text-[#7B1E1E] mb-3 border-b border-gray-100 pb-2">{groupName}</h3>

              {Object.entries(categories).map(([categoryName, options]) => (
                <div key={categoryName} className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">{categoryName}</h4>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {options.map((opt, idx) => (
                      <div
                        key={`${opt.name}-${idx}`}
                        className="flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 hover:bg-gray-100 px-3 py-2 transition"
                      >
                        {opt.icon && <LucideIconRenderer iconName={opt.icon as any} size={16} color="#374151" />}
                        <span className="text-sm text-gray-700 font-medium">{opt.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
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
    if (!['single_select', 'multi_select'].includes(inputType)) continue

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
    }
  }

  return result
}
