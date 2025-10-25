'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { getMethod } from '@/services/service'
import { appEnpoints } from '@/services/endpoints'
import PropertyCategoryMappingForm, {
  FormValues,
} from '@/components/admin/forms/PropertyCategoryMappingForm'

export interface PropertyCategory {
  id: number
  name: string
  description?: string
  isActive?: boolean
  sortOrder?: number
}

export interface Feature {
  id: string | number
  name: string
  mandatory: boolean
  filterable: boolean
  active: boolean
}

export default function AddPropertyCategoryMapping() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [loading, setLoading] = useState(true)
  const [propertyCategory, setPropertyCategory] = useState<PropertyCategory>()
  const [features, setFeatures] = useState<Feature[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch property category
        const categoryRes = await getMethod(
          appEnpoints.getPropertyCategoryByID(id),
        )
        if (categoryRes?.data) setPropertyCategory(categoryRes.data)

        // Fetch all features
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
  }, [id])

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading data...
      </div>
    )

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <span>Dashboard</span> <span>›</span>
        <span>Property Mapping</span> <span>›</span>
        <span className="font-medium text-gray-700">Add Mapping</span>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">
          Property Category Mapping
        </h2>

        <PropertyCategoryMappingForm
          propertyCategory={propertyCategory}
          features={features}
          onSuccess={() => {
            toast.success('Property category mapping saved successfully!')
            router.push('/admin/dashboard/property-categories')
          }}
        />
      </div>
    </div>
  )
}
