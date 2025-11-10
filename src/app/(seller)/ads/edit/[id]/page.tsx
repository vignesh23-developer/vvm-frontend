'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import AdsForm from '../../(components)/AdsForm'
import { getAdById } from '../../(action)/ads_action'
import { AdsCreationFormValues } from '../../page'
import toast from 'react-hot-toast'

export default function AdsEditPage() {
  const params = useParams()
  const router = useRouter()
  const adId = params.id as string
  const [adData, setAdData] = useState<Partial<AdsCreationFormValues> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAd = async () => {
      try {
        setIsLoading(true)
        const response = await getAdById(adId)
        
        if (response.error) {
          setError(response.message || 'Failed to load ad')
          toast.error(response.message || 'Failed to load ad')
          return
        }

        // Map the API response to form values
        const ad = response.data
        setAdData({
          title: ad.title || '',
          description: ad.description || '',
          category_id: ad.category_id || '',
          price: ad.price || '',
          price_unit: ad.price_unit || 'USD',
          is_negotiable: ad.is_negotiable || false,
          status: ad.status || 'AVAILABLE',
          is_published: ad.is_published || false,
          is_boosted: ad.is_boosted || false,
          address_line: ad.address_line || '',
          city: ad.city || '',
          district: ad.district || '',
          state: ad.state || '',
          postal_code: ad.postal_code || '',
          country: ad.country || 'USA',
          latitude: ad.latitude || 0,
          longitude: ad.longitude || 0,
          contact_name: ad.contact_name || '',
          contact_phone: ad.contact_phone || '',
          contact_email: ad.contact_email || '',
        })
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load ad'
        setError(errorMessage)
        toast.error(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    if (adId) {
      fetchAd()
    }
  }, [adId])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#7B1E1E] mx-auto" />
          <p className="mt-4 text-gray-600">Loading ad details...</p>
        </div>
      </div>
    )
  }

  if (error || !adData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Ad not found'}</p>
          <button
            onClick={() => router.push('/ads/list')}
            className="px-4 py-2 bg-[#7B1E1E] text-white rounded-lg hover:bg-[#641717]"
          >
            Back to Ads List
          </button>
        </div>
      </div>
    )
  }

  return <AdsForm mode="edit" initialData={adData} adId={adId} />
}
