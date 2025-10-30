// components/LocationPickerModal.tsx
'use client'

import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import MapView from '@/components/ui/map/MapView'
import { X } from 'lucide-react'
import toast from 'react-hot-toast'

type LocationPickerModalProps = {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  initialLat: number
  initialLng: number
  onLocationSelect: (lat: number, lng: number, address: AddressParts, fullAddress: string) => void
}

export type AddressParts = {
  doorNumber?: string
  streetName?: string
  city?: string
  district?: string
  postalCode?: string
}

export default function LocationPickerModal({ open, setOpen, initialLat, initialLng, onLocationSelect }: LocationPickerModalProps) {
  const [selectedLat, setSelectedLat] = useState<number>(initialLat)
  const [selectedLng, setSelectedLng] = useState<number>(initialLng)

  useEffect(() => {
    // if (!open) return

    if (!('geolocation' in navigator)) {
      console.log('Geolocation is not supported by your browser')
      toast.error('Geolocation is not supported by your browser')
      return
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords
        setSelectedLat(latitude)
        setSelectedLng(longitude)
      },
      error => {
        console.log('log on get current location:', error)

        toast.error(error.message)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    )
  }, [])

  const handleMapClick = (lat: number, lng: number) => {
    setSelectedLat(lat)
    setSelectedLng(lng)
  }

  const handleSave = () => {
    try {
      const geocoder = new google.maps.Geocoder()
      const latlng = { lat: selectedLat, lng: selectedLng }

      geocoder
        .geocode({ location: latlng })
        .then(response => {
          if (response.results[0]) {
            const result = response.results?.[0]
            const components = result.address_components

            const addressParts: AddressParts = {}

            for (const comp of components) {
              const types = comp.types
              if (types.includes('street_number')) {
                addressParts.doorNumber = comp.long_name
              }
              if (types.includes('route')) {
                addressParts.streetName = comp.long_name
              }
              if (types.includes('locality')) {
                addressParts.city = comp.long_name
              }
              if (types.includes('administrative_area_level_2')) {
                addressParts.district = comp.long_name
              }
              if (types.includes('postal_code')) {
                addressParts.postalCode = comp.long_name
              }
            }

            console.log('log on error :', response)
            onLocationSelect(selectedLat, selectedLng, addressParts, result?.formatted_address)
            // setAddress(response.results[0])
          } else {
            toast.error('No address found')
          }
        })
        .catch(e => {
          console.error(e)
          toast.error('Faild to pick address')
          //   setError('Geocoder failed: ' + (e as Error).message)
        })

      setOpen(false)
    } catch (e) {
      console.log('error log on select location on google map:', e)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4">
      <div
        className="bg-white rounded-lg 
                  w-full max-w-2xl md:max-w-3xl xl:max-w-4xl 
                  h-full md:h-[90%] xl:h-[75%] 
                  overflow-hidden shadow-lg flex flex-col"
      >
        {/* Header */}
        <div className="px-4 py-4 flex justify-between">
          <h2 className="text-xl font-semibold">Pick Location</h2>
        </div>
        {/* Body (map container) */}
        <div className="flex-grow px-5 md:px-11">
          <div className="h-full">
            <MapView
              center={{ lat: selectedLat, lng: selectedLng }}
              zoom={14}
              markers={[{ lat: selectedLat, lng: selectedLng }]}
              onMapClick={handleMapClick}
            />
          </div>
        </div>
        {/* Footer */}
        <div className="px-4 py-3 flex justify-end gap-2">
          <button type="button" className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300" onClick={() => setOpen(false)}>
            Cancel
          </button>
          <button type="button" className="px-4 py-2 rounded bg-[#7B1E1E] text-white hover:bg-blue-700" onClick={handleSave}>
            Save Location
          </button>
        </div>
      </div>
    </div>
  )
}
