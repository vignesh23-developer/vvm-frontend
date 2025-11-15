// // components/ui/map/MapView.tsx
// 'use client'

// import { GoogleMap, MarkerF, useJsApiLoader } from '@react-google-maps/api'
// import { useRef, useState } from 'react'

// type LatLng = { lat: number; lng: number }

// type MapViewProps = {
//   center: LatLng
//   zoom: number
//   markers: LatLng[]
//   onMapClick?: (lat: number, lng: number) => void
// }

// export default function MapView({ center, zoom, markers, onMapClick }: MapViewProps) {
//   const { isLoaded, loadError } = useJsApiLoader({
//     googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
//     libraries: ['places'],
//   })

//   const inputRef = useRef<HTMLInputElement>(null)
//   const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null)

//   if (loadError) return <div>Error loading map</div>
//   if (!isLoaded) return <div>Loading map…</div>

//   const MY_BOUNDS = {
//     north: 13.5833, // ~13°35′N  :contentReference[oaicite:2]{index=2}
//     south: 8.0667, // ~8°4′N    :contentReference[oaicite:3]{index=3}
//     west: 76.3, // ~76°18′E  :contentReference[oaicite:4]{index=4}
//     east: 80.33, // ~80°20′E  :contentReference[oaicite:5]{index=5}
//   }

//   return (
//     <div>
//       <input ref={inputRef} placeholder="Start typing address…" style={{ width: '300px', padding: '8px' }} />

//       <GoogleMap
//         options={{
//           restriction: {
//             latLngBounds: MY_BOUNDS,
//             strictBounds: true,
//           },
//         }}
//         zoom={zoom}
//         center={center}
//         mapContainerStyle={{ width: '100%', height: '100%' }}
//         onClick={e => {
//           const lat = e.latLng?.lat() ?? 0
//           const lng = e.latLng?.lng() ?? 0
//           if (onMapClick) onMapClick(lat, lng)
//         }}
//       >
//         {markers.map((m: LatLng, idx: number) => (
//           <MarkerF key={idx} position={m} />
//         ))}
//       </GoogleMap>
//     </div>
//   )
// }

// components/ui/map/MapView.tsx
'use client'

import { useRef, useState, useEffect } from 'react'
import { GoogleMap, MarkerF, useJsApiLoader } from '@react-google-maps/api'

type LatLng = { lat: number; lng: number }

type MapViewProps = {
  center: LatLng
  zoom: number
  markers: LatLng[]
  onMapClick?: (lat: number, lng: number) => void
  ifTextSearch?: boolean
}

export default function MapView({ center, zoom, markers, onMapClick, ifTextSearch }: MapViewProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: ['places'],
  })

  const inputRef = useRef<HTMLInputElement>(null)
  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null)

  const MY_BOUNDS = {
    north: 13.5833,
    south: 8.0667,
    west: 76.3,
    east: 80.33,
  }

  useEffect(() => {
    if (!isLoaded || !inputRef.current) return

    const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
      fields: ['formatted_address', 'geometry', 'address_components'],
      componentRestrictions: { country: ['IN'] },
      bounds: MY_BOUNDS,
      strictBounds: false, // you can set true if you want strictly inside
    })

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace()
      setSelectedPlace(place)
      if (place.geometry?.location) {
        const lat = place.geometry.location.lat()
        const lng = place.geometry.location.lng()
        // Optionally: you may call onMapClick or some callback to inform parent component
        if (onMapClick) {
          onMapClick(lat, lng)
        }
      }
    })

    // cleanup
    return () => {
      // google.maps.event.clearInstanceListeners(autocomplete)  // if needed
    }
  }, [isLoaded, onMapClick])

  if (loadError) return <div>Error loading map</div>
  if (!isLoaded) return <div>Loading map…</div>

  const mapCenter = selectedPlace?.geometry?.location
    ? {
        lat: selectedPlace.geometry.location.lat(),
        lng: selectedPlace.geometry.location.lng(),
      }
    : center

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {ifTextSearch && <input ref={inputRef} placeholder="Start typing address…" className="w-full p-2 border border-gray-300 rounded-md mb-2.5" />}

      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '85%' }}
        zoom={zoom}
        center={mapCenter}
        // options={{
        //   restriction: {
        //     latLngBounds: MY_BOUNDS,
        //     strictBounds: true,
        //   },
        // }}
        onClick={e => {
          const lat = e.latLng?.lat() ?? 0
          const lng = e.latLng?.lng() ?? 0
          if (onMapClick) onMapClick(lat, lng)
        }}
      >
        {markers.map((m: LatLng, idx: number) => (
          <MarkerF key={idx} position={m} />
        ))}

        {selectedPlace?.geometry?.location && (
          <MarkerF
            position={{
              lat: selectedPlace.geometry.location.lat(),
              lng: selectedPlace.geometry.location.lng(),
            }}
          />
        )}
      </GoogleMap>
    </div>
  )
}
