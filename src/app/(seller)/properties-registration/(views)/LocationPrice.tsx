'use client'

import { FormikProps } from 'formik'
import { PropertyCreationFormValues } from '../page'
import FormikTextField from '@/components/ui/Formik/FormikTextField/FormikTextField'
import LocationPickerModal, { AddressParts } from '@/components/ui/map/LocationPickerModal'
import { useState } from 'react'

interface Step2LocationPriceProps {
  formik: FormikProps<PropertyCreationFormValues>
}

const districts = [
  'Ariyalur',
  'Chengalpattu',
  'Chennai',
  'Coimbatore',
  'Cuddalore',
  'Dharmapuri',
  'Dindigul',
  'Erode',
  'Kallakurichi',
  'Kancheepuram',
  'Karur',
  'Krishnagiri',
  'Madurai',
  'Mayiladuthurai',
  'Nagapattinam',
  'Kanyakumari',
  'Namakkal',
  'Perambalur',
  'Pudukkottai',
  'Ramanathapuram',
  'Salem',
  'Sivaganga',
  'Thanjavur',
  'Theni',
  'Thiruvallur',
  'Thiruvarur',
  'Tiruchirappalli',
  'Tirunelveli',
  'Tiruppur',
  'Tiruvannamalai',
  'Vellore',
  'Viluppuram',
  'Virudhunagar',
]

const districtToCities: Record<string, string[]> = {
  Ariyalur: ['Ariyalur', 'Jayankondam', 'Sendurai'],
  Chengalpattu: ['Chengalpattu', 'Tirukalukundram', 'Tambaram'],
  Chennai: ['Chennai', 'T. Nagar', 'Velachery', 'Adyar'],
  Coimbatore: ['Coimbatore', 'Sulur', 'Annur', 'Kovaipudur'],
  Cuddalore: ['Cuddalore', 'Virudhachalam', 'Panruti'],
  Dharmapuri: ['Dharmapuri', 'Krishnagiri', 'Hosur'],
  Dindigul: ['Dindigul', 'Palani', 'Kodaikanal'],
  Erode: ['Erode', 'Bhavani', 'Sathyamangalam'],
  Kallakurichi: ['Kallakurichi', 'Ulundurpet', 'Chinnasalem'],
  Kanchipuram: ['Kanchipuram', 'Sriperumbudur', 'Pallavaram'],
  Kanyakumari: ['Nagercoil', 'Kanyakumari', 'Marungoor'],
  Karur: ['Karur', 'Kulithalai', 'Aravakkurichi'],
  Krishnagiri: ['Krishnagiri', 'Hosur', 'DharmapuriTown'],
  Madurai: ['Madurai', 'Melur', 'Thirumangalam', 'Usilampatti'], // cities from Wikipedia note for Madurai district. :contentReference[oaicite:1]{index=1}
  Mayiladuthurai: ['Mayiladuthurai', 'Sirkazhi', 'Kollidam'],
  Nagapattinam: ['Nagapattinam', 'Thiruthuraipoondi', 'Velankanni'],
  Namakkal: ['Namakkal', 'Tiruchengode', 'Rasipuram'],
  Nilgiris: ['Ooty (Udhagamandalam)', 'Coonoor', 'Kotagiri'],
  Perambalur: ['Perambalur', 'AriyalurTown'],
  Pudukkottai: ['Pudukkottai', 'Alangudi', 'Kunnaur'],
  Ramanathapuram: ['Ramanathapuram', 'Rameswaram', 'Karaikudi'],
  Ranipet: ['Ranipet', 'Arakkonam', 'Walajapet'],
  Salem: ['Salem', 'Yercaud', 'Kottampatti'],
  Sivaganga: ['Sivaganga', 'Karaikudi', 'Chettinad'],
  Thanjavur: ['Thanjavur', 'Kumbakonam', 'Papanasam'],
  Theni: ['Theni', 'Periyakulam', 'Cumbum'],
  Thoothukudi: ['Thoothukudi', 'Kovilpatti', 'Palayamkottai'],
  Tiruchirappalli: ['Tiruchirappalli', 'Srirangam', 'Manapparai'], // from Wikipedia cities list. :contentReference[oaicite:2]{index=2}
  Tirunelveli: ['Tirunelveli', 'Nagercoil', 'Ambasamudram'],
  Tirupattur: ['Tirupattur', 'Vaniyambadi', 'Jolarpettai'],
  Tiruppur: ['Tiruppur', 'Avinashi', 'Kangeyam'],
  Tiruvallur: ['Tiruvallur', 'Ponneri', 'Uthukottai'],
  Tiruvannamalai: ['Tiruvannamalai', 'Cheyyar', 'Arani'],
  Tiruvarur: ['Tiruvarur', 'Nannilam', 'Kudavasal'],
  Vellore: ['Vellore', 'Ranipet', 'Gudiyattam'],
  Viluppuram: ['Viluppuram', 'Tindivanam', 'Ulundurpet'],
  Virudhunagar: ['Virudhunagar', 'Kovilpatti', 'Sivakasi'],
}

export default function Step2LocationPrice({ formik }: Step2LocationPriceProps) {
  const { values, errors, touched, handleChange, setFieldValue } = formik

  const [isMapView, setIsMapView] = useState<boolean>(false)

  const [fullAddress, setFullAddress] = useState<string | null>(null)

  return (
    <div className="w-full max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-6">Location &amp; Pricing</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {/* District */}
        <div>
          <label className="block text-sm font-medium mb-1">District</label>
          <select
            name="district"
            value={values.district}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Select district</option>
            {districts?.map((val, idx) => (
              <option key={idx} value={val}>
                {val}
              </option>
            ))}
          </select>
          {touched.district && errors.district && <p className="text-red-600 text-xs mt-1">{errors.district}</p>}
        </div>

        {/* Town/City */}
        <div>
          <label className="block text-sm font-medium mb-1">Town/City</label>
          <select
            name="city"
            value={values.city}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Select City</option>
            {districtToCities[values?.district]?.map((val, idx) => (
              <option key={idx} value={val}>
                {val}
              </option>
            ))}
          </select>
          {touched.city && errors.city && <p className="text-red-600 text-xs mt-1">{errors.city}</p>}
        </div>
      </div>

      {/* Door No. & Street Name */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
        <FormikTextField type="text" placeholder="Enter door number" label={'Door Number'} name={'door_number'} />
        <FormikTextField type="text" placeholder="Enter street name" label={'Street Name'} name={'street_name'} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
        {/* Postal Code */}
        <FormikTextField type="text" placeholder="Enter postal code" label={'Postal Code'} name={'postal_code'} />

        {/* State & Country */}
        <div>
          <label className="block text-sm font-medium mb-1">
            State <span className="text-red-500">*</span>
          </label>
          <select
            name="state"
            value={values.state}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="Tamil Nadu">Tamil Nadu</option>
          </select>
          {touched.state && errors.state && <p className="text-red-600 text-xs mt-1">{errors.state}</p>}
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Select Location Via Google Map</label>
        <button
          type="button"
          onClick={() => setIsMapView(!isMapView)}
          className="w-full rounded-md border border-gray-300bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Pick Location
        </button>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Country <span className="text-red-500">*</span>
        </label>
        <select
          name="country"
          value={values.country}
          onChange={handleChange}
          className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="India">India</option>
        </select>
        {touched.country && errors.country && <p className="text-red-600 text-xs mt-1">{errors.country}</p>}
      </div>

      {/* Complete Address */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Complete Address <span className="text-red-500">*</span>
        </label>
        <textarea
          name="address_line"
          value={values.address_line}
          onChange={handleChange}
          placeholder="Enter complete address"
          rows={3}
          className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        {touched.address_line && errors.address_line && <p className="text-red-600 text-xs mt-1">{errors.address_line}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {/* Price */}
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

        {/* Property Size */}
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
              <option value="Sqft">Sqft</option>
              <option value="Sqm">Sqm</option>
              <option value="Acre">Acre</option>
            </select>
          </div>
          {touched.size && errors.size && <p className="text-red-600 text-xs mt-1">{errors.size}</p>}
        </div>
      </div>

      <LocationPickerModal
        open={isMapView}
        setOpen={setIsMapView}
        initialLat={values?.latitude}
        initialLng={values?.longitude}
        onLocationSelect={function (lat: number, lng: number, address: AddressParts, fullAddress: string): void {
          console.log('loc select', address)
          setFieldValue('latitude', lat ?? '')
          setFieldValue('longitude', lng ?? '')
          setFieldValue('district', address?.district ?? '')
          setFieldValue('city', address?.city ?? '')
          setFieldValue('door_number', address?.doorNumber ?? '')
          setFieldValue('street_name', address?.streetName ?? '')
          setFieldValue('postal_code', address?.postalCode ?? '')
          setFieldValue('address_line', fullAddress ?? '')
        }}
      />
    </div>
  )
}
