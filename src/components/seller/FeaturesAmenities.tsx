'use client'

import { Plus } from 'lucide-react'
import { useState, useMemo } from 'react'

interface Amenity {
  id: string
  name: string
  selected: boolean
}

interface Step3FeaturesAmenitiesProps {
  amenities: Amenity[]
  setAmenities: React.Dispatch<React.SetStateAction<Amenity[]>>
}

export default function Step3FeaturesAmenities({ 
  amenities, 
  setAmenities 
}: Step3FeaturesAmenitiesProps) {
  const [customFeature, setCustomFeature] = useState('')
  const [showInput, setShowInput] = useState(false)

  // Memoized selected names
  const selectedAmenities = useMemo(
    () => amenities.filter(a => a.selected).map(a => a.name),
    [amenities],
  )

  const toggleAmenity = (id: string) => {
    setAmenities(prev =>
      prev.map(a => (a.id === id ? { ...a, selected: !a.selected } : a)),
    )
  }

  const addCustomFeature = () => {
    if (!customFeature.trim()) return
    setAmenities(prev => [
      ...prev,
      {
        id: `custom-${Date.now()}`,
        name: customFeature.trim(),
        selected: true,
      },
    ])
    setCustomFeature('')
    setShowInput(false)
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Features & Amenities
        </h2>
        <p className="text-gray-600 text-sm">Select Amenities</p>
      </div>

      {/* Amenities Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
        {amenities.map(a => (
          <button
            key={a.id}
            onClick={() => toggleAmenity(a.id)}
            className={`px-4 py-3 rounded-lg border-2 transition-all duration-200 
          ${
            a.selected
              ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
          }
        `}
          >
            {a.name}
          </button>
        ))}
      </div>

      {/* Additional Features */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Additional Features
        </h3>

        {showInput ? (
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={customFeature}
              onChange={e => setCustomFeature(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') addCustomFeature()
                if (e.key === 'Escape') {
                  setShowInput(false)
                  setCustomFeature('')
                }
              }}
              placeholder="Enter custom feature"
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg 
                     focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <button
              onClick={addCustomFeature}
              disabled={!customFeature.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg 
                     hover:bg-blue-700 disabled:bg-gray-400"
            >
              Add
            </button>
            <button
              onClick={() => {
                setShowInput(false)
                setCustomFeature('')
              }}
              className="px-4 py-3 border-2 border-gray-200 text-gray-600 rounded-lg 
                     hover:border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowInput(true)}
            className="flex items-center gap-2 px-4 py-3 border-2 border-dashed 
                   border-gray-300 text-gray-600 rounded-lg hover:border-gray-400 
                   hover:bg-gray-50 transition w-full sm:w-auto"
          >
            <span>Add custom feature</span>
            <div className="ml-auto w-8 h-8 bg-red-600 rounded-md flex items-center justify-center text-white">
              <Plus size={16} />
            </div>
          </button>
        )}
      </div>

      {/* Selected Count */}
      {selectedAmenities.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg text-blue-700 text-sm">
          {selectedAmenities.length} amenities selected
        </div>
      )}
    </div>
  )
}