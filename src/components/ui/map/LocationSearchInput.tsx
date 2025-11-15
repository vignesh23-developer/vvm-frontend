'use client'

import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { useJsApiLoader } from '@react-google-maps/api'
import toast from 'react-hot-toast'

export type AddressParts = {
  doorNumber?: string
  streetName?: string
  city?: string
  district?: string
  state?: string
  country?: string
  postalCode?: string
}

interface LocationSearchBoxProps {
  label?: string
  name?: string
  placeholder?: string
  onSelectLocation: (lat: number, lng: number, address: string, addressParts: AddressParts) => void
  // optional controlled value (useful when parent drives the value, e.g. edit mode)
  value?: string
  // notify parent of input changes
  onChange?: (value: string) => void
}

export default function LocationSearchBox({
  label = 'Full Address',
  name = 'address_line',
  placeholder = 'Search for a location...',
  onSelectLocation,
  value: valueProp,
  onChange,
}: LocationSearchBoxProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: ['places'],
  })

  const inputRef = useRef<HTMLInputElement>(null)
  const [value, setValue] = useState<string>(valueProp ?? '')

  // keep internal input state in sync when parent provides a controlled value (edit mode)
  useEffect(() => {
    if (typeof valueProp === 'string') setValue(valueProp)
  }, [valueProp])

  useEffect(() => {
    if (!isLoaded || !inputRef.current) return

    const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
      fields: ['formatted_address', 'geometry', 'address_components'],
      componentRestrictions: { country: ['IN'] },
    })

    const handlePlaceChanged = () => {
      const place = autocomplete.getPlace()
      if (!place.geometry?.location) {
        toast.error('No location found for this place')
        return
      }

      const lat = place.geometry.location.lat()
      const lng = place.geometry.location.lng()
      const formattedAddress = place.formatted_address || ''
      const components = place.address_components || []

      const addressParts: AddressParts = {}

      for (const comp of components) {
        const types = comp.types
        if (types.includes('street_number')) addressParts.doorNumber = comp.long_name
        if (types.includes('route')) addressParts.streetName = comp.long_name
        if (types.includes('locality')) addressParts.city = comp.long_name
        if (types.includes('administrative_area_level_3')) addressParts.district = comp.long_name
        if (types.includes('administrative_area_level_1')) addressParts.state = comp.long_name
        if (types.includes('postal_code')) addressParts.postalCode = comp.long_name
        if (types.includes('country')) addressParts.country = comp.long_name
      }

      // Fallback: try to parse street number + street from formatted address if missing
      if (!addressParts.streetName || !addressParts.doorNumber) {
        const parts = formattedAddress.split(',')
        if (!addressParts.streetName && parts[0]) addressParts.streetName = parts[0].trim()
        if (!addressParts.doorNumber && parts[0]) {
          const match = parts[0].trim().match(/^\d+/)
          if (match) addressParts.doorNumber = match[0]
        }
      }

      setValue(formattedAddress)
      if (typeof onChange === 'function') {
        onChange(formattedAddress)
      } else {
        onSelectLocation(lat, lng, formattedAddress, addressParts)
      }
    }

    const listener = autocomplete.addListener('place_changed', handlePlaceChanged)

    return () => {
      try {
        // remove listener and clear instance listeners to avoid leaks
        if (listener && typeof (listener as any).remove === 'function') {
          ;(listener as any).remove()
        }
        if (autocomplete && (google as any)?.maps?.event?.clearInstanceListeners) {
          ;(google as any).maps.event.clearInstanceListeners(autocomplete)
        }
      } catch (err) {
        // ignore cleanup errors
      }
    }
  }, [isLoaded, onSelectLocation, onChange])

  if (loadError) return <p>Error loading Google Maps</p>
  if (!isLoaded) return <p>Loading...</p>

  return (
    <div className="relative w-full">
      <label htmlFor={name} className="block text-sm font-medium mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          name={name}
          value={value}
          onChange={(e: any) => {
            const v = e.target.value
            setValue(v)
            if (typeof onChange === 'function') onChange(v)
          }}
          placeholder={placeholder}
          className="w-full flex border border-gray-300 rounded-md mb-4 pr-10 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#7B1E1E]"
        />

        {value && (
          <button
            type="button"
            aria-label="Clear"
            onClick={() => {
              setValue('')
              onChange?.('')
              onSelectLocation(0, 0, '', {
                doorNumber: '',
                streetName: '',
                city: '',
                district: '',
                state: '',
                country: '',
                postalCode: '',
              })
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 
               flex items-center justify-center 
               h-6 w-6 rounded-md border 
               border-red-300 text-gray-500 
               hover:bg-gray-100 hover:border-gray-400 cursor-pointer
               transition-all"
          >
            <X color="red" size={14} />
          </button>
        )}
      </div>
    </div>
  )
}
