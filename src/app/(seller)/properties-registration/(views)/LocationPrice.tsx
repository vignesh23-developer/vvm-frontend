'use client'

import { FormikProps } from 'formik'
import { PropertyCreationFormValues } from '../page'
import FormikTextField from '@/components/ui/Formik/FormikTextField/FormikTextField'
import LocationPickerModal, { AddressParts } from '@/components/ui/map/LocationPickerModal'
import LocationSearchBox from '@/components/ui/map/LocationSearchInput'
import { useState } from 'react'
import Button from '@/components/ui/CustomComponent/Button/Button'
import { Pin } from 'lucide-react'
import { PropertyCategory } from '@/app/(seller)/properties-registration/(dto)/properties_registration_dto'
import { isLayoutCategory } from '@/utils/property/isLayoutCategory'

interface Step2LocationPriceProps {
  formik: FormikProps<PropertyCreationFormValues>
  propertyCategories?: PropertyCategory[]
}

const AREA_UNITS = ['Sqft', 'Cent', 'Acre'] as const

export default function Step2LocationPrice({ formik, propertyCategories = [] }: Step2LocationPriceProps) {
  const { values, errors, touched, handleChange, setFieldValue } = formik
  const [isMapView, setIsMapView] = useState(false)

  const selectedCategory = propertyCategories.find(c => c.id === values.propertyType)
  const isLayout = isLayoutCategory(selectedCategory?.name)

  const toFiniteNumber = (value: unknown, fallback = 0) => {
    const n = typeof value === 'number' ? value : Number(value)
    return Number.isFinite(n) ? n : fallback
  }

  const handleLocationSelect = (
    setFieldValue: (field: string, value: any) => void,
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
    <div className="w-full max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">Location & Pricing</h2>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="w-full sm:flex-1">
          <LocationSearchBox
            label="Full Address"
            name="address_line"
            placeholder="Enter address line"
            value={values.address_line}
            onSelectLocation={(lat, lng, fullAddress, parts) => handleLocationSelect(setFieldValue, lat, lng, parts, fullAddress)}
          />
        </div>

        <div className="w-full sm:w-auto">
          <Button
            type="button"
            onClick={() => setIsMapView(prev => !prev)}
            title="Pick Location from Map"
            className="flex h-10 w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-gray-100 px-6 py-2 font-medium text-gray-800 transition hover:bg-gray-200 sm:w-auto"
          >
            <Pin size={18} className="text-red-500" />
            Map
          </Button>
        </div>
      </div>

      <div className="space-y-4 mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormikTextField label="Door Number" name="door_number" placeholder="Enter door number" />
          <FormikTextField label="Street Name" name="street_name" placeholder="Enter street name" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormikTextField
            label="City / Town"
            name="city"
            readOnly
            placeholder="Enter city"
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed text-gray-700 focus:outline-none focus:ring-0 focus:border-gray-300"
          />
          <FormikTextField label="District" name="district" placeholder="Enter district" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <FormikTextField
            label="State"
            name="state"
            readOnly
            placeholder="Enter state"
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed text-gray-700 focus:outline-none focus:ring-0 focus:border-gray-300"
          />
          <FormikTextField
            label="Country"
            name="country"
            readOnly
            placeholder="Enter country"
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed text-gray-700 focus:outline-none focus:ring-0 focus:border-gray-300"
          />
          <FormikTextField label="Postal Code" name="postal_code" placeholder="Enter postal code" />
        </div>
      </div>

      {/* Standard pricing — non-layout categories */}
      {!isLayout && (
        <div className="border-t border-gray-200 pt-6 space-y-4">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Pricing & Size</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">
                Price <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center border border-gray-300 rounded-md">
                <span className="px-3 text-gray-500">₹</span>
                <input
                  type="number"
                  name="price"
                  value={values.price}
                  onChange={handleChange}
                  placeholder="Enter price"
                  className="w-full rounded-r-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              {touched.price && errors.price && <p className="text-red-600 text-xs mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Property Size <span className="text-red-500">*</span>
              </label>
              <div className="flex">
                <input
                  type="number"
                  name="size"
                  value={values.size}
                  onChange={handleChange}
                  placeholder="Size"
                  className="w-full rounded-l-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <select
                  name="unit"
                  value={values.unit}
                  onChange={handleChange}
                  className="rounded-r-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {AREA_UNITS.map(u => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
              {touched.size && errors.size && <p className="text-red-600 text-xs mt-1">{errors.size}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Layout details — layout category only */}
      {isLayout && (
        <div className="border-t border-gray-200 pt-6 space-y-4">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Layout Details</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormikTextField label="Layout Price Min (₹) *" name="layout_price_min" placeholder="e.g., 4500000" />
            <FormikTextField label="Layout Price Max (₹)" name="layout_price_max" placeholder="e.g., 9500000" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">
                Layout Area Min <span className="text-red-500">*</span>
              </label>
              <div className="flex">
                <input
                  type="number"
                  name="layout_area_min_sqft"
                  value={values.layout_area_min_sqft}
                  onChange={handleChange}
                  placeholder="e.g., 800"
                  className="w-full rounded-l-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <select
                  name="layout_area_unit"
                  value={values.layout_area_unit || 'Sqft'}
                  onChange={handleChange}
                  className="rounded-r-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {AREA_UNITS.map(u => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
              {touched.layout_area_min_sqft && (errors as any).layout_area_min_sqft && (
                <p className="text-red-600 text-xs mt-1">{(errors as any).layout_area_min_sqft}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Layout Area Max</label>
              <div className="flex">
                <input
                  type="number"
                  name="layout_area_max_sqft"
                  value={values.layout_area_max_sqft}
                  onChange={handleChange}
                  placeholder="e.g., 2200"
                  className="w-full rounded-l-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <select
                  name="layout_area_unit"
                  value={values.layout_area_unit || 'Sqft'}
                  onChange={handleChange}
                  className="rounded-r-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {AREA_UNITS.map(u => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <FormikTextField label="Layout Total Sqft" name="layout_total_sqft" placeholder="e.g., 1450" />
            <FormikTextField label="Total Plots" name="plot_total_count" placeholder="e.g., 120" />
            <FormikTextField label="Available Plots" name="plot_available_count" placeholder="e.g., 65" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormikTextField label="Sold Plots" name="plot_sold_count" placeholder="e.g., 40" />
            <FormikTextField label="Booked Plots" name="plot_booked_count" placeholder="e.g., 15" />
          </div>
        </div>
      )}

      {/* Offer — below price-related fields */}
      <div className="border-t border-gray-200 pt-6 space-y-2">
        <label htmlFor="offer" className="block text-sm font-medium text-gray-800">
          Offer <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <input
          id="offer"
          name="offer"
          type="text"
          placeholder="e.g. 10% off for early buyers, Free registration..."
          value={values.offer || ''}
          onChange={handleChange}
          maxLength={255}
          aria-invalid={!!((errors as any).offer && (touched as any).offer)}
          className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none
            ${(errors as any).offer && (touched as any).offer ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
        />
        {(touched as any).offer && (errors as any).offer && (
          <p className="text-red-600 text-xs mt-1">{(errors as any).offer}</p>
        )}
        <div className="text-xs text-gray-500">{(values.offer || '').length}/255 characters</div>
      </div>

      <LocationPickerModal
        open={isMapView}
        setOpen={setIsMapView}
        initialLat={toFiniteNumber(values?.latitude, 0)}
        initialLng={toFiniteNumber(values?.longitude, 0)}
        onLocationSelect={(lat, lng, address: AddressParts, fullAddress) => {
          setFieldValue('latitude', lat)
          setFieldValue('longitude', lng)
          setFieldValue('district', address?.district ?? '')
          setFieldValue('city', address?.city ?? '')
          setFieldValue('door_number', address?.doorNumber ?? '')
          setFieldValue('street_name', address?.streetName ?? '')
          setFieldValue('postal_code', address?.postalCode ?? '')
          setFieldValue('address_line', fullAddress ?? '')
          setFieldValue('state', address?.state ?? '')
          setFieldValue('country', address?.country ?? '')
        }}
      />
    </div>
  )
}
