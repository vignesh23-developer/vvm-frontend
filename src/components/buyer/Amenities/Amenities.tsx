'use client'

import React, { useMemo } from 'react'
import { Check } from 'lucide-react'
import LucideIconRenderer from '@/components/ui/CustomComponent/LucideIconRenderer/LucideIconRenderer'

interface AmenitiesProps {
  title?: string
  PropertyAmenities?: any[]
}

const Amenities: React.FC<AmenitiesProps> = ({ title, PropertyAmenities = [] }) => {
  const { detailGroups, amenityGroups } = useMemo(
    () => extractGroupedFeatures(PropertyAmenities),
    [PropertyAmenities]
  )

  const hasDetails = Object.keys(detailGroups).length > 0
  const hasAmenities = Object.keys(amenityGroups).length > 0

  if (!hasDetails && !hasAmenities) {
    return (
      <div className="w-full">
        <p className="text-gray-500 italic text-sm mt-4">No amenities available.</p>
      </div>
    )
  }

  return (
    <div className="w-full space-y-8">
      {/* DETAILS SECTION - Numeric & Select values (label/value format) */}
      {Object.entries(detailGroups).map(([groupName, items]) => (
        <section key={`detail-${groupName}`} className="py-2">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-2">
            <h3 className="text-xl font-bold text-[#2a1407]">{groupName}</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-5">
            {items.map((item, idx) => (
              <div key={`${item.categoryName}-${idx}`} className="flex flex-col">
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
                  {item.categoryName}
                </span>
                <span className="text-base font-semibold text-gray-900">
                  {item.displayValue}
                  {item.unit && <span className="text-sm font-normal text-gray-600 ml-1">{item.unit}</span>}
                </span>
              </div>
            ))}
          </div>

          {/* Boolean Amenities within this group (if any) */}
          {amenityGroups[groupName] && amenityGroups[groupName].length > 0 && (
            <div className="mt-5">
              <div className="flex flex-wrap gap-2">
                {amenityGroups[groupName].map((amenity, idx) => (
                  <AmenityChip key={`${amenity.name}-${idx}`} amenity={amenity} />
                ))}
              </div>
            </div>
          )}
        </section>
      ))}

      {/* STANDALONE AMENITY GROUPS - Groups that only have boolean amenities */}
      {Object.entries(amenityGroups)
        .filter(([groupName]) => !detailGroups[groupName])
        .map(([groupName, amenities]) => (
          <section key={`amenity-${groupName}`} className="py-2">
            <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-2">
              <h3 className="text-xl font-bold text-[#2a1407]">{groupName}</h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {amenities.map((amenity, idx) => (
                <AmenityChip key={`${amenity.name}-${idx}`} amenity={amenity} />
              ))}
            </div>
          </section>
        ))}
    </div>
  )
}

export default Amenities

// ============================================================================
// Amenity Chip Component - Amber/Yellow theme to match design
// ============================================================================

interface AmenityChipProps {
  amenity: AmenityItem
}

const AmenityChip: React.FC<AmenityChipProps> = ({ amenity }) => {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-[#e6d5c3] bg-[#faf6f1] px-3 py-1.5 transition-colors hover:bg-[#f5ede3]">
      {amenity.icon ? (
        <LucideIconRenderer iconName={amenity.icon as any} size={14} className="text-[#8b6914]" />
      ) : (
        <Check size={14} className="text-[#8b6914]" strokeWidth={2.5} />
      )}
      <span className="text-sm text-[#2a1407] font-medium">{amenity.name}</span>
    </div>
  )
}

// ============================================================================
// Types
// ============================================================================

interface DetailItem {
  categoryName: string
  displayValue: string
  unit?: string
  sortOrder: number
}

interface AmenityItem {
  name: string
  icon?: string
  sortOrder: number
}

interface GroupedFeatures {
  detailGroups: { [groupName: string]: DetailItem[] }
  amenityGroups: { [groupName: string]: AmenityItem[] }
}

// ============================================================================
// Data Extraction Logic
// ============================================================================

const extractGroupedFeatures = (featureValues: any[]): GroupedFeatures => {
  const detailGroups: { [groupName: string]: DetailItem[] } = {}
  const amenityGroups: { [groupName: string]: AmenityItem[] } = {}

  if (!Array.isArray(featureValues)) {
    return { detailGroups, amenityGroups }
  }

  // Sort by group sort_order first, then by feature_category sort_order
  const sortedFeatures = [...featureValues].sort((a, b) => {
    const groupOrderA = a?.feature_group?.sort_order ?? 999
    const groupOrderB = b?.feature_group?.sort_order ?? 999
    if (groupOrderA !== groupOrderB) return groupOrderA - groupOrderB

    const orderA = a?.feature_category?.sort_order ?? 999
    const orderB = b?.feature_category?.sort_order ?? 999
    return orderA - orderB
  })

  for (const f of sortedFeatures) {
    const inputType = f?.feature_category?.input_type
    const groupName = f?.feature_group?.name || 'Other'
    const categoryName = f?.feature_category?.name || 'General'
    const categoryIcon = f?.feature_category?.icon || ''
    const sortOrder = f?.feature_category?.sort_order ?? 999

    // Handle BOOLEAN type - these are amenities (checkmark chips)
    if (inputType === 'boolean') {
      // Only show if value is true
      if (f.values === 'true' || f.values === true) {
        amenityGroups[groupName] ||= []
        amenityGroups[groupName].push({
          name: categoryName,
          icon: categoryIcon,
          sortOrder,
        })
      }
      continue
    }

    // Handle SINGLE_SELECT / MULTI_SELECT - show option names
    if (inputType === 'single_select' || inputType === 'multi_select') {
      if (Array.isArray(f.feature_options) && f.feature_options.length > 0) {
        detailGroups[groupName] ||= []

        // For multi-select, join all option names
        const displayValue = f.feature_options.map((opt: any) => opt.name).join(', ')

        detailGroups[groupName].push({
          categoryName,
          displayValue,
          sortOrder,
        })
      }
      continue
    }

    // Handle NUMERIC type - show value with optional unit
    if (inputType === 'numeric') {
      if (f.values !== undefined && f.values !== null && f.values !== '') {
        detailGroups[groupName] ||= []
        detailGroups[groupName].push({
          categoryName,
          displayValue: formatNumber(f.values),
          unit: f.units || getDefaultUnit(f?.feature_category?.code),
          sortOrder,
        })
      }
      continue
    }

    // Handle TEXT type - show as detail
    if (inputType === 'text') {
      if (f.values !== undefined && f.values !== null && f.values !== '') {
        detailGroups[groupName] ||= []
        detailGroups[groupName].push({
          categoryName,
          displayValue: String(f.values),
          sortOrder,
        })
      }
      continue
    }
  }

  return { detailGroups, amenityGroups }
}

// Format numbers with commas (Indian format)
const formatNumber = (value: any): string => {
  const num = parseFloat(value)
  if (isNaN(num)) return String(value)

  // Indian number format (12,34,567)
  return num.toLocaleString('en-IN')
}

// Get default unit based on feature code
const getDefaultUnit = (code?: string): string => {
  if (!code) return ''

  const unitMap: Record<string, string> = {
    built_up_area: 'Sqft',
    plot_area: 'Sqft',
    carpet_area: 'Sqft',
    road_width: 'ft',
    num_borewells: '',
  }

  return unitMap[code] || ''
}