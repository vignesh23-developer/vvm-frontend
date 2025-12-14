'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/AuthContext/AuthContextProvider'
import Button from '@/components/ui/CustomComponent/Button/Button'
import Pagination from '@/components/ui/CustomComponent/Paginations/Pagination'
import CustomLoader from '@/components/ui/CustomComponent/Loader/CustomLoader'
import ModalComponent from '@/components/ui/CustomComponent/Modal/ModalComponent'
import PropertyCard from '@/components/buyer/PropertyCard/PropertyCard'
import { useAdsModeration } from '@/app/admin/dashboard/ads-pending-approval/(hooks)/useAdsModeration'
import { AdsDto } from '@/app/(seller)/ads/dto/AdsDto'
import { appEndpoints } from '@/services/endpoints'
import { postMethod, getMethod } from '@/services/service'
import { getUserRoles, hasRole, Roles } from '@/utils/roles/roles'
import PropertyOrAdsApproveRejectCard from '@/components/buyer/PropertyOrAdsApproveRejectCard/PropertyOrAdsCard'

const PAGE_SIZE = 10
const AdsPendingApprovalPage = () => {
  const router = useRouter()
  const { user } = useAuth()
  const userRoles = getUserRoles(user)
  const onlyAdmin = hasRole(userRoles, [Roles.ADMIN])
  const [activeTab, setActiveTab] = useState<'pending' | 'rejected'>('pending')
  const [currentPage, setCurrentPage] = useState(1)
  const [tabCounts, setTabCounts] = useState<{ pending?: number; rejected?: number }>({})

  const [selectedAd, setSelectedAd] = useState<AdsDto | null>(null)

  // Approval modal state
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false)
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject' | null>(null)
  const [approvalComment, setApprovalComment] = useState('')
  const [rejectReason, setRejectReason] = useState('')
  const [approvalSubmitting, setApprovalSubmitting] = useState(false)

  const approvalStatus = activeTab === 'pending' ? 'UNDER_REVIEW' : 'REJECTED'

  const { ads, total, isLoading, error, handleAdAction, mutateAds } = useAdsModeration({
    page: currentPage,
    limit: PAGE_SIZE,
    approvalStatus,
  })

  const reviewerId = user?.id || ''

  useEffect(() => {
    if (typeof total === 'number') {
      setTabCounts(prev => ({ ...prev, [activeTab]: total }))
    }
  }, [total, activeTab])

  const totalItems = total ?? 0
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE))
  const isEmpty = totalItems === 0

  const handleTabChange = (tabKey: 'pending' | 'rejected') => {
    setActiveTab(tabKey)
    setCurrentPage(1)
  }

  const handleFavoriteToggle = async (adId: string) => {
    if (!adId) return

    try {
      const response = await postMethod(appEndpoints.toggleFavorite, {
        entity_type: 'ad',
        entity_id: adId,
      })

      if (response.error) {
        toast.error(response.message || 'Failed to update favorite')
        return
      }

      toast.success('Favorite updated')
      await mutateAds()
    } catch (err) {
      console.error('Failed to toggle favorite for ad', err)
      toast.error('Unable to update favorite right now')
    }
  }

  const changePage = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)))

  const pendingCount = tabCounts.pending ?? (activeTab === 'pending' ? totalItems : 0)
  const rejectedCount = tabCounts.rejected ?? (activeTab === 'rejected' ? totalItems : 0)

  const openApprovalModal = (ad: AdsDto, action: 'approve' | 'reject') => {
    setSelectedAd(ad)
    setApprovalAction(action)
    setApprovalComment('')
    setRejectReason('')
    setIsApprovalModalOpen(true)
  }

  const closeApprovalModal = () => {
    setIsApprovalModalOpen(false)
    setSelectedAd(null)
  }

  const handleApprovalSubmit = async () => {
    if (!selectedAd || !approvalAction) return
    if (!reviewerId) {
      toast.error('Missing reviewer information')
      return
    }

    setApprovalSubmitting(true)
    try {
      const extraData = {
        comment: approvalAction === 'approve' ? approvalComment : approvalComment,
        rejectReason: approvalAction === 'reject' ? rejectReason : undefined,
      }

      const success = await handleAdAction(selectedAd.id, reviewerId, approvalAction, extraData)
      if (success) {
        setIsApprovalModalOpen(false)
      }
    } finally {
      setApprovalSubmitting(false)
    }
  }

  const handleShare = useCallback(() => {
    // if (typeof window !== 'undefined') {
    //   navigator?.clipboard?.writeText(window.location.href)
    //   toast.success('Link copied to clipboard')
    // }
    console.log('Share clicked')
  }, [])

  const tabs = useMemo(
    () => [
      { key: 'pending', label: `Pending (${pendingCount ?? '...'})` },
      { key: 'rejected', label: `Rejected (${rejectedCount ?? '...'})` },
    ],
    [pendingCount, rejectedCount],
  )

  if (isLoading) {
    return <CustomLoader text="Loading ads..." />
  }

  if (error) {
    return <div className="p-6 text-red-600">Failed to load ads.</div>
  }

  return (
    <div className="w-full p-10">
      <div className="mb-6 border-b border-gray-200 pb-3 flex flex-wrap gap-2">
        {tabs.map(tab => {
          const isActive = tab.key === activeTab
          return (
            <Button
              key={tab.key}
              onClick={() => handleTabChange(tab.key as 'pending' | 'rejected')}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition focus:ring-2 focus:ring-offset-2 ${
                isActive ? 'border-[#2a1407] bg-[#2a1407] text-white' : 'border-gray-200 text-gray-700 hover:text-[#2a1407]'
              }`}
            >
              {tab.label}
            </Button>
          )
        })}
      </div>

      {!isEmpty && (
        <div className="text-sm text-gray-600 mb-4">
          <span className="text-left block">
            Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, totalItems)} of {totalItems}
          </span>
        </div>
      )}

      {isEmpty ? (
        <div className="rounded-md border border-dashed border-gray-200 bg-white p-12 text-center text-gray-500">No ads available.</div>
      ) : (
        <div className="grid gap-6">
          {ads.map(ad => (
            <PropertyOrAdsApproveRejectCard
              key={ad.id}
              {...(ad as any)}
              title={ad.title}
              description={ad.description}
              price={ad.price}
              property_size={ad.view_count?.toString() || '0'}
              property_size_unit="views"
              status={ad.status}
              address_line={ad.address_line}
              approval_status={ad.approval_status ?? 'UNDER_REVIEW'}
              favorite_count={ad.favorite_count ?? 0}
              images={ad.images ?? []}
              primaryActionLabel={activeTab === 'pending' ? 'Approve' : 'Approve Again'}
              secondaryActionLabel="Reject"
              thirdActionLabel="View Details"
              onPrimaryAction={() => openApprovalModal(ad, 'approve')}
              onSecondaryAction={() => openApprovalModal(ad, 'reject')}
              onThirdAction={() => router.push(`/adsDetails/${ad.id}`)}
              handleFavorite={() => handleFavoriteToggle(ad.id)}
              handleShare={handleShare}
              isUserFavorited={Boolean(ad.is_user_favorite)}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination totalItems={totalItems} itemsPerPage={PAGE_SIZE} currentPage={currentPage} onPageChange={changePage} />
        </div>
      )}

      {/* Approval Modal */}
      <ModalComponent
        open={isApprovalModalOpen}
        onClose={closeApprovalModal}
        title={approvalAction === 'approve' ? 'Approve Ad' : 'Reject Ad'}
        footer={
          <div className="flex justify-end gap-3">
            <Button className="border px-4 py-2 text-sm" onClick={closeApprovalModal} disabled={approvalSubmitting}>
              Cancel
            </Button>
            <Button className="bg-[#2a1407] text-white px-4 py-2 text-sm" onClick={handleApprovalSubmit} disabled={approvalSubmitting}>
              {approvalSubmitting ? 'Processing...' : 'Confirm'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4 text-sm text-gray-700">
          <p>
            Are you sure you want to <span className="font-semibold">{approvalAction}</span> the ad{' '}
            <span className="font-semibold">{selectedAd?.title ?? 'this listing'}</span>?
          </p>

          {approvalAction === 'reject' && (
            <>
              <select
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                className="w-full rounded-md border px-3 py-2 text-sm focus:border-[#2a1407] focus:ring-[#2a1407]"
              >
                <option value="">Select a reason</option>
                <option value="FAKE_INFO">Fake Information</option>
                <option value="SCAM">Scam / Fraudulent</option>
                <option value="INAPPROPRIATE">Inappropriate Content</option>
                <option value="OTHER">Other</option>
              </select>

              <textarea
                value={approvalComment}
                onChange={e => setApprovalComment(e.target.value)}
                className="w-full rounded-md border px-3 py-2 text-sm focus:border-[#2a1407] focus:ring-[#2a1407]"
                placeholder="Rejection notes (optional)"
                rows={3}
              />
            </>
          )}
        </div>
      </ModalComponent>
    </div>
  )
}

export default AdsPendingApprovalPage
