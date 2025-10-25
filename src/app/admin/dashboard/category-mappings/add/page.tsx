'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { getMethod, postMethod } from '@/services/service'
import { appEnpoints } from '@/services/endpoints'
import { ChevronDown, ChevronRight } from 'lucide-react'

export interface PropertyCategory {
  id: number
  name: string
  description?: string
  isActive?: boolean
  sortOrder?: number
}

interface Feature {
  id: string | number
  name: string
  mandatory: boolean
  filterable: boolean
  active: boolean
}

interface Field {
  name: string
  mandatory?: boolean
  checked: boolean
}

type FieldGroups = Record<'area' | 'building' | 'property', Field[]>

export default function AddPropertyCategoryMapping() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [propertyCategories, setPropertyCategories] = useState<
    PropertyCategory[]
  >([])
  const [features, setFeatures] = useState<Feature[]>([])
  const [propertyCategory, setPropertyCategory] = useState<string>('')

  const [fields, setFields] = useState<FieldGroups>({
    area: [
      { name: 'Carpet Area', mandatory: true, checked: true },
      { name: 'Built-up Area', mandatory: false, checked: true },
      { name: 'Plot Area', mandatory: false, checked: false },
    ],
    building: [
      { name: 'Total Floors', mandatory: true, checked: true },
      { name: 'Floor Number', mandatory: true, checked: true },
      { name: 'Monthly Maintenance', mandatory: false, checked: true },
    ],
    property: [
      { name: 'Property Age', checked: true },
      { name: 'Corner Property', checked: false },
      { name: 'Possession Status', checked: true },
    ],
  })

  const [collapsed, setCollapsed] = useState({
    area: false,
    building: false,
    property: false,
  })

  // ---- Fetch categories and features ----
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // 1️⃣ Get property categories
        const categoryRes = await getMethod(
          appEnpoints.getAllPropertyCategories,
        )
        if (categoryRes?.data) {
          setPropertyCategories(categoryRes.data)
          // Default select first category by name
          setPropertyCategory(categoryRes.data[0]?.name || '')
        }

        // 2️⃣ Get features
        const featureRes = await getMethod(appEnpoints.getAllFeatureCategories)
        if (featureRes?.data) {
          const formatted = featureRes.data.map((f: any) => ({
            id: f.id,
            name: f.name,
            mandatory: f.isMandatory ?? false,
            filterable: f.isFilterable ?? false,
            active: true,
          }))
          setFeatures(formatted)
        }
      } catch (err) {
        console.error(err)
        toast.error('Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // ---- Toggles ----
  const toggleCollapse = (section: keyof typeof collapsed) =>
    setCollapsed(prev => ({ ...prev, [section]: !prev[section] }))

  const toggleFeature = (idx: number) =>
    setFeatures(prev =>
      prev.map((f, i) => (i === idx ? { ...f, active: !f.active } : f)),
    )

  console.log('features', features)
  const toggleField = (section: keyof FieldGroups, index: number) =>
    setFields(prev => ({
      ...prev,
      [section]: prev[section].map((f, i) =>
        i === index ? { ...f, checked: !f.checked } : f,
      ),
    }))

  // ---- Save ----
  const handleSave = async () => {
    try {
      const payload = { propertyCategory, features, fields } // propertyCategory = NAME, not ID
      console.log('Saving configuration:', payload)

      const response = await postMethod(
        appEnpoints.mapFeaturesToPropertyCategory,
        payload,
      )
      if (response.data.error) {
        toast.error(response.data.message || 'Failed to save mapping')
        return
      }

      toast.success('Property category mapping saved successfully!')
      // router.push('/admin/dashboard/category-mapping')
    } catch (error: any) {
      console.error(error)
      toast.error(error?.message || 'Something went wrong')
    }
  }

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading data...
      </div>
    )

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <span>Dashboard</span>
        <span className="text-gray-400">›</span>
        <span>Property Mapping</span>
        <span className="text-gray-400">›</span>
        <span className="font-medium text-gray-700">Add Mapping</span>
      </div>

      {/* Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">
          Property Category Mapping
        </h2>

        {/* Select Property Category */}
        <div className="mb-6 max-w-xs">
          <label className="block mb-2 font-medium text-gray-700">
            Select Property Category:
          </label>
          <select
            className="form-select w-full border rounded-md p-2"
            value={propertyCategory}
            onChange={e => setPropertyCategory(e.target.value)} // ✅ now using value = category.name
          >
            {propertyCategories.map(c => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Mapped Features */}
        <div className="mb-8">
          <p className="font-semibold mb-2">
            Uncategorize Features for:{' '}
            <span className="text-gray-600 capitalize">{propertyCategory}</span>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {features.map((f, idx) => (
              <div
                key={f.id}
                className={`border rounded-md p-4 ${
                  f.active ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                }`}
              >
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={f.active}
                    onChange={() => toggleFeature(idx)}
                  />
                  <span className="font-medium">{f.name}</span>
                </label>
                <div className="text-sm text-gray-500 mt-1">
                  {f.mandatory ? 'Mandatory' : 'Optional'} •{' '}
                  {f.filterable ? 'Filterable' : 'Non-filterable'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Property Fields */}
        <div className="mb-8">
          <p className="font-semibold mb-4">Categorize</p>
          {[
            { key: 'area', title: 'Area Fields' },
            { key: 'building', title: 'Building Fields' },
            { key: 'property', title: 'Property Details' },
          ].map(section => (
            <div key={section.key} className="border rounded-md mb-4">
              <button
                type="button"
                onClick={() =>
                  toggleCollapse(section.key as keyof typeof collapsed)
                }
                className="w-full flex items-center gap-2 p-3 bg-gray-50 font-medium"
              >
                {collapsed[section.key as keyof typeof collapsed] ? (
                  <ChevronRight size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
                {section.title}
              </button>
              {!collapsed[section.key as keyof typeof collapsed] && (
                <div className="p-4 space-y-2">
                  {fields[section.key as keyof typeof fields].map((f, i) => (
                    <label key={i} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={f.checked}
                        onChange={() =>
                          toggleField(section.key as keyof FieldGroups, i)
                        }
                      />
                      <span>
                        {f.name}{' '}
                        {f.mandatory !== undefined && (
                          <span className="text-gray-500 text-sm">
                            ({f.mandatory ? 'Mandatory' : 'Optional'})
                          </span>
                        )}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Save */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 cursor-pointer text-white px-5 py-2 rounded-md flex items-center gap-2"
          >
            💾 Save Configuration
          </button>
        </div>
      </div>
    </div>
  )
}
