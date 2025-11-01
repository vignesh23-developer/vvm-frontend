'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { getMethod } from '@/services/service'
import { appEndpoints } from '@/services/endpoints'
import PropertyCategoryMappingForm, { FormValues } from '@/components/admin/forms/PropertyCategoryMappingForm'
import { isMap } from 'util/types'

export interface PropertyCategory {
  property_category_id: number
  property_category_name: string
  mappings: any[]
}

export interface Feature {
  id: string | number
  name: string
  isMandatory: boolean
  isFilterable: boolean
  isActive: boolean
  sortOrder?: number
  featureGroupId?: string | number
  featureGroupName?: string
  featureGroupSortOrder?: number
  isMapped?: boolean
}

export interface FeatureGroup {
  featureGroupId: string | number
  featureGroupName: string
  featureGroupSortOrder?: number
  features: Feature[]
}

export default function AddPropertyCategoryMapping() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [loading, setLoading] = useState(true)
  const [propertyCategory, setPropertyCategory] = useState<PropertyCategory>()
  const [features, setFeatures] = useState<FeatureGroup[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch property category
        const propertyCategoryMappingRes = await getMethod(appEndpoints.getPropertyCategoryFeatureMappingByID(id))
        const propertyCategoryData = propertyCategoryMappingRes?.data as PropertyCategory | undefined
        if (propertyCategoryData) setPropertyCategory(propertyCategoryData)

        // Fetch all features
        const featureRes = await getMethod(appEndpoints.getAllFeatureCategories)
        const featureData = Array.isArray(featureRes?.data) ? (featureRes.data as any[]) : []
        if (featureData.length) {
          const formatted = featureData.map((f: any) => ({
            id: f.id,
            name: f.name,
            isMandatory: f.isMandatory ?? false,
            isFilterable: f.isFilterable ?? false,
            isActive: f.isActive ?? true,
            sortOrder: f.sortOrder ?? 0,
            featureGroupId: f.featureGroupId,
            featureGroupName: f.featureGroupName,
            isMapped: propertyCategoryData?.mappings?.some((m: any) => m.feature_category_id === f.id),
          }))

          // Group by featureGroupId, with "Uncategorized" for null values
          const groupedFeatures = formatted.reduce((acc: any, feature: any) => {
            const groupId = feature.featureGroupId || 'uncategorized'
            const groupName = feature.featureGroupName || 'Uncategorized'

            if (!acc[groupId]) {
              acc[groupId] = {
                featureGroupId: groupId,
                featureGroupName: groupName,
                featureGroupSortOrder: feature.featureGroupSortOrder ?? 0,
                features: [],
              }
            }

            acc[groupId].features.push(feature)
            return acc
          }, {})

          // Optional: sort groups by featureGroupSortOrder
          const finalList = (Object.values(groupedFeatures) as FeatureGroup[]).sort(
            (a, b) => (a.featureGroupSortOrder ?? 0) - (b.featureGroupSortOrder ?? 0),
          )
          setFeatures(finalList)
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

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading data...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">Property Category Mapping</h2>

        <PropertyCategoryMappingForm
          propertyCategory={propertyCategory}
          featuresGrouped={features}
          onSuccess={() => {
            toast.success('Property category mapping saved successfully!')
            router.push('/admin/dashboard/property-category')
          }}
        />
      </div>
    </div>
  )
}
