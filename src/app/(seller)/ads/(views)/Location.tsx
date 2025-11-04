'use client'

import { FormikProps } from 'formik'
import { AdsCreationFormValues } from '../page'
import FormikTextField from '@/components/ui/Formik/FormikTextField/FormikTextField'
import LocationPickerModal, { AddressParts } from '@/components/ui/map/LocationPickerModal'
import { useState } from 'react'

interface Step2LocationProps {
  formik: FormikProps<AdsCreationFormValues>
}

export default function Step2Location({ formik }: Step2LocationProps) {
  const { values, errors, touched, handleChange, setFieldValue } = formik
  const [isMapView, setIsMapView] = useState<boolean>(false)

  // US States for example - can be replaced with any country's states/provinces
  const states = [
    'NY', 'CA', 'TX', 'FL', 'IL', 'PA', 'OH', 'GA', 'NC', 'MI',
    'NJ', 'VA', 'WA', 'AZ', 'MA', 'TN', 'IN', 'MO', 'MD', 'WI'
  ]

  const countries = ['USA', 'Canada', 'UK', 'India', 'Australia']

  return (
    <div className="w-full mt-8 p-6 bg-white shadow-md rounded-xl border border-gray-200 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Location Details</h2>
        <p className="text-gray-600 text-sm mt-1">Provide the location information for your ad</p>
      </div>

      <div className="space-y-6">
        {/* Address Line */}
        <div>
          <FormikTextField
            isrequired
            type="text"
            placeholder="e.g., 123 Main St"
            label="Address Line"
            name="address_line"
          />
        </div>

        {/* City and District */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <FormikTextField
              isrequired
              type="text"
              placeholder="Enter city"
              label="City"
              name="city"
            />
          </div>

          <div>
            <FormikTextField
              isrequired
              type="text"
              placeholder="Enter district"
              label="District"
              name="district"
            />
          </div>
        </div>

        {/* State and Postal Code */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              State <span className="text-red-500">*</span>
            </label>
            <select
              name="state"
              value={values.state}
              onChange={handleChange}
              className={`mt-2 w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-[#7B1E1E] focus:outline-none
                ${errors.state && touched.state ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
            >
              <option value="">Select state</option>
              {states.map(state => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            {touched.state && errors.state && (
              <p className="text-red-600 text-xs mt-1">{errors.state}</p>
            )}
          </div>

          <div>
            <FormikTextField
              isrequired
              type="text"
              placeholder="e.g., 10001"
              label="Postal Code"
              name="postal_code"
            />
          </div>
        </div>

        {/* Country */}
        <div>
          <label className="block text-sm font-semibold text-gray-700">
            Country <span className="text-red-500">*</span>
          </label>
          <select
            name="country"
            value={values.country}
            onChange={handleChange}
            className={`mt-2 w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-[#7B1E1E] focus:outline-none
              ${errors.country && touched.country ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
          >
            {countries.map(country => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
          {touched.country && errors.country && (
            <p className="text-red-600 text-xs mt-1">{errors.country}</p>
          )}
        </div>

        {/* Latitude and Longitude (Optional) */}
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

        {/* Location Picker Button */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Select Location Via Google Map
          </label>
          <button
            type="button"
            onClick={() => setIsMapView(!isMapView)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#7B1E1E] focus:ring-offset-2 transition-colors duration-150"
          >
            📍 Pick Location from Map
          </button>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700">
            <strong>Tip:</strong> Providing accurate location details helps potential buyers find your ad more easily.
            You can use the map picker to automatically fill in address details.
          </p>
        </div>
      </div>

      {/* LocationPickerModal */}
      <LocationPickerModal
        open={isMapView}
        setOpen={setIsMapView}
        initialLat={values?.latitude || 40.7128}
        initialLng={values?.longitude || -74.0060}
        onLocationSelect={(lat: number, lng: number, address: AddressParts, fullAddress: string) => {
          setFieldValue('latitude', lat)
          setFieldValue('longitude', lng)
          setFieldValue('district', address?.district ?? '')
          setFieldValue('city', address?.city ?? '')
          setFieldValue('postal_code', address?.postalCode ?? '')
          setFieldValue('address_line', fullAddress ?? '')
        }}
      />
    </div>
  )
}
