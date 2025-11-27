import useSWR from 'swr'
import { useRouter } from 'next/navigation'
import { appEndpoints } from '@/services/endpoints'
import { getMethod, putMethod } from '@/services/service'
import { ResponseDTO } from '@/components/dto/response_dto'
import { PropertyDetailsResponseDto } from '@/app/(buyer)/(site)/propertyDetails/dto/propertiesDetailDto'
import { toast } from 'react-hot-toast'

const fetcher = async (endpoint: string) => getMethod<PropertyDetailsResponseDto>(endpoint)

interface UsePropertiesDetailParams {
  id: string | string[] | undefined
}

export default function usePropertiesDetail({ id }: UsePropertiesDetailParams) {
  const router = useRouter()
  const propertyId = Array.isArray(id) ? id[0] : id

  const swrKey = propertyId ? `${appEndpoints.getPropertyByID(propertyId)}` : null

  const { data, error, isLoading, mutate: mutateProperties } = useSWR<ResponseDTO<PropertyDetailsResponseDto>>(swrKey, fetcher)

  const handleApproveOrRejectAction = async (
    propertyId: string,
    reviewer_id: string,
    action: 'approve' | 'reject',
    extraData?: { comment?: string; rejectReason?: string },
  ) => {
    const endpoint = action === 'approve' ? appEndpoints.approveProperty(propertyId as string) : appEndpoints.rejectProperty(propertyId as string)

    // status data to be sent in the request body
    let payload = {}
    if (action === 'approve' && extraData?.comment) {
      payload = {
        reviewer_id: reviewer_id,
        // comments: extraData.comment,
      }
    } else if (action === 'reject' && extraData?.rejectReason) {
      payload = {
        reviewer_id: reviewer_id,
        rejection_reason: extraData.rejectReason,
        comments: extraData.comment,
      }
    }
    try {
      const response = await putMethod(endpoint, payload)
      if (response.error) {
        toast.error(`Failed to ${action} property: ${response.message}`)
        return
      } else {
        toast.success(`Property ${action}ed successfully`)
        await mutateProperties()
        router.refresh()
      }
    } catch (error) {
      console.error(`Failed to ${action} property:`, error)
      toast.error(`An error occurred while trying to ${action} the property`)
    }
  }

  return {
    propertyDetailsData: data?.data,
    propertyDetailsFetchLoader: isLoading,
    propertyDetailsFetchErr: error ?? (data?.error ? new Error(data.message) : undefined),
    propertyDetailsRefresh: mutateProperties,
    handleApproveOrRejectAction,
  }
}
