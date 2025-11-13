'use client'

import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'

export type AddressParts = {
  doorNumber?: string
  streetName?: string
  city?: string
  district?: string
  postalCode?: string
  state?: string
  country?: string
  [key: string]: any
}

interface LocationSearchInputProps {
  placeholder?: string
  onLocationSelect: (lat: number, lng: number, addressParts: AddressParts, fullAddress: string) => void
}

export default function LocationSearchInput({ placeholder = 'Enter address or location...', onLocationSelect }: LocationSearchInputProps) {
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<HTMLInputElement | null>(null)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)

  useEffect(() => {
    if (!window.google || !window.google.maps) {
      toast.error('Google Maps not loaded properly')
      return
    }

    if (!inputRef.current) return

    // Initialize Google Autocomplete
    const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
      types: ['geocode'],
      componentRestrictions: { country: 'in' }, // restrict to India (optional)
    })
    autocompleteRef.current = autocomplete

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace()
      if (!place.geometry || !place.geometry.location) {
        toast.error('No location data found for this place')
        return
      }

      const lat = place.geometry.location.lat()
      const lng = place.geometry.location.lng()
      const components = place.address_components || []
      const addressParts: AddressParts = {}

      for (const comp of components) {
        const types = comp.types
        if (types.includes('street_number')) addressParts.doorNumber = comp.long_name
        if (types.includes('route')) addressParts.streetName = comp.long_name
        if (types.includes('locality')) addressParts.city = comp.long_name
        if (types.includes('administrative_area_level_1')) addressParts.state = comp.long_name
        if (types.includes('postal_code')) addressParts.postalCode = comp.long_name
        if (types.includes('country')) addressParts.country = comp.long_name
        if (types.includes('administrative_area_level_3')) addressParts.district = comp.long_name
      }

      onLocationSelect(lat, lng, addressParts, place.formatted_address || inputValue)
      setInputValue(place.formatted_address || '')
    })
  }, [onLocationSelect])

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#7B1E1E]"
      />
    </div>
  )
}
