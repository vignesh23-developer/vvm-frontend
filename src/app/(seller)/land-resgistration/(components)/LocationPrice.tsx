'use client'

interface FormDataStep2 {
  district: string
  city: string
  address: string
  price: string
  size: string
  unit: string
}

interface Step2LocationPriceProps {
  formDataStep2: FormDataStep2
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void
}

export default function Step2LocationPrice({
  formDataStep2,
  handleChange,
}: Step2LocationPriceProps) {
  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-6">Location &amp; Pricing</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {/* District */}
        <div>
          <label className="block text-sm font-medium mb-1">
            District <span className="text-red-500">*</span>
          </label>
          <select
            name="district"
            value={formDataStep2.district}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Select district</option>
            <option value="Coimbatore">Coimbatore</option>
            <option value="Chennai">Chennai</option>
            <option value="Madurai">Madurai</option>
          </select>
        </div>

        {/* Town/City */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Town/City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="city"
            value={formDataStep2.city}
            onChange={handleChange}
            placeholder="Enter town or city"
            className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Complete Address */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Complete Address <span className="text-red-500">*</span>
        </label>
        <textarea
          name="address"
          value={formDataStep2.address}
          onChange={handleChange}
          placeholder="Enter complete address"
          rows={3}
          className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
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
              value={formDataStep2.price}
              onChange={handleChange}
              placeholder="Enter price"
              className="w-full rounded-r-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
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
              value={formDataStep2.size}
              onChange={handleChange}
              placeholder="Size"
              className="w-full rounded-l-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <select
              name="unit"
              value={formDataStep2.unit}
              onChange={handleChange}
              className="rounded-r-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="Sqft">Sqft</option>
              <option value="Sqm">Sqm</option>
              <option value="Acre">Acre</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}
