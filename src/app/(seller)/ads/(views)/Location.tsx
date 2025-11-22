'use client'

import { FormikProps } from 'formik'
import { AdsCreationFormValues } from '../page'
import FormikTextField from '@/components/ui/Formik/FormikTextField/FormikTextField'
import LocationPickerModal, { AddressParts } from '@/components/ui/map/LocationPickerModal'
import LocationSearchBox from '@/components/ui/map/LocationSearchInput'
import { useState } from 'react'

interface Step2LocationProps {
  formik: FormikProps<AdsCreationFormValues>
}

export default function Step2Location({ formik }: Step2LocationProps) {
  const { values, errors, touched, handleChange, setFieldValue } = formik
  const [isMapView, setIsMapView] = useState<boolean>(false)

  const handleLocationSelect = (
    lat: number,
    lng: number,
    address: AddressParts,
    fullAddress: string,
  ) => {
    setFieldValue('latitude', lat)
    setFieldValue('longitude', lng)
    setFieldValue('district', address?.district ?? '')
    setFieldValue('door_number', address?.doorNumber ?? '')
    setFieldValue('street_name', address?.streetName ?? '')
    setFieldValue('city', address?.city ?? '')
    setFieldValue('state', address?.state ?? '')
    setFieldValue('postal_code', address?.postalCode ?? '')
    setFieldValue('country', address?.country ?? '')
    setFieldValue('address_line', fullAddress ?? '')
  }

  return (
    <div className="w-full mt-8 p-6 bg-white shadow-md rounded-xl border border-gray-200 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Location Details</h2>
        <p className="text-gray-600 text-sm mt-1">Provide the location information for your ad</p>
      </div>

      <div className="space-y-6">
        {/* Address Section */}
        <div className="space-y-4">
          <LocationSearchBox
            label="Full Address"
            name="address_line"
            placeholder="Enter address line"
            value={values.address_line}
            onSelectLocation={(lat, lng, fullAddress, parts) => handleLocationSelect(lat, lng, parts, fullAddress)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormikTextField label="Door Number" name="door_number" placeholder="Enter door number" />
            <FormikTextField label="Street Name" name="street_name" placeholder="Enter street name" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormikTextField
              label="Country"
              name="country"
              readOnly
              placeholder="Enter country"
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed text-gray-700 focus:outline-none focus:ring-0 focus:border-gray-300"
            />

            <FormikTextField
              label="State"
              name="state"
              readOnly
              placeholder="Enter state"
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed text-gray-700 focus:outline-none focus:ring-0 focus:border-gray-300"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <FormikTextField
              label="District"
              name="district"
              readOnly
              placeholder="Enter district"
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed text-gray-700 focus:outline-none focus:ring-0 focus:border-gray-300"
            />
            <FormikTextField
              label="City / Town"
              name="city"
              readOnly
              placeholder="Enter city"
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed text-gray-700 focus:outline-none focus:ring-0 focus:border-gray-300"
            />
            <FormikTextField
              label="Postal Code"
              name="postal_code"
              readOnly
              placeholder="Enter postal code"
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed text-gray-700 focus:outline-none focus:ring-0 focus:border-gray-300"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Latitude <span className="text-gray-400">(Optional)</span>
            </label>
            <input
              type="number"
              step="any"
              name="latitude"
              value={values.latitude}
              onChange={handleChange}
              placeholder="e.g., 40.7128"
              className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#7B1E1E] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Longitude <span className="text-gray-400">(Optional)</span>
            </label>
            <input
              type="number"
              step="any"
              name="longitude"
              value={values.longitude}
              onChange={handleChange}
              placeholder="e.g., -74.0060"
              className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#7B1E1E] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Select Location Via Google Map</label>
          <button
            type="button"
            onClick={() => setIsMapView(!isMapView)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#7B1E1E] focus:ring-offset-2 transition-colors duration-150"
          >
            📍 Pick Location from Map
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700">
            <strong>Tip:</strong> Providing accurate location details helps potential buyers find your ad more easily. Use the search box or map picker to fill the form automatically.
          </p>
        </div>
      </div>

      <LocationPickerModal
        open={isMapView}
        setOpen={setIsMapView}
        initialLat={values?.latitude || 13.0827}
        initialLng={values?.longitude || 80.2707}
        onLocationSelect={(lat: number, lng: number, address: AddressParts, fullAddress: string) =>
          handleLocationSelect(lat, lng, address, fullAddress)
        }
      />
    </div>
  )
}
