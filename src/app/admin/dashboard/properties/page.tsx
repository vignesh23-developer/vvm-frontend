'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import PropertyCard from '@/components/buyer/PropertyCard/PropertyCard'
import { useProperties } from '@/app/admin/dashboard/properties/(Hooks)/useProperties'
import { useTranslations } from 'next-intl'
import ModalComponent from '@/components/ui/CustomComponent/Modal/ModalComponent'
import Button from '@/components/ui/CustomComponent/Button/Button'
import { PropertiesDto } from './(Dto)/propertiesDto'
import { getLocalStorageItem } from '@/utils/local_storage/local_storage_handler'
import { deleteMethod, postMethod } from '@/services/service'
import { appEndpoints } from '@/services/endpoints'
import Pagination from '@/components/ui/CustomComponent/Paginations/Pagination'
import CustomLoader from '@/components/ui/CustomComponent/Loader/CustomLoader'

const PAGE_SIZE = 10

const PropertiesPage = () => {
  const t = useTranslations()
  const [activeTab, setActiveTab] = useState('pending')
  const [currentPage, setCurrentPage] = useState(1)
  const [favoritedProperties, setFavoritedProperties] = useState<Set<string>>(new Set())
  const [pendingActionPropertyId, setPendingActionPropertyId] = useState<string | null>(null)
  const [modalAction, setModalAction] = useState<'approve' | 'reject' | null>(null)
  const [selectedProperty, setSelectedProperty] = useState<PropertiesDto | null>(null)
  const [comment, setComment] = useState('')
  const [rejectReason, setRejectReason] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Map UI tabs to API approval_status values
  const approvalStatus = activeTab === 'pending' ? 'UNDER_REVIEW' : activeTab === 'rejected' ? 'REJECTED' : undefined

  const { properties, total, isLoading, error, mutateProperties, handlePropertyAction } = useProperties({
    page: currentPage,
    limit: PAGE_SIZE,
    approvalStatus,
  })
  const reviewerId = (getLocalStorageItem('userData') as { id?: string })?.id || ''

  const tabs = useMemo(
    () => [
      { key: 'pending', label: 'Pending' },
      { key: 'rejected', label: 'Rejected' },
    ],
    [],
  )

  const totalItems = total ?? 0
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE))
  const isEmpty = totalItems === 0

  const openModal = (property: PropertiesDto, action: 'approve' | 'reject') => {
    setSelectedProperty(property)
    setModalAction(action)
    setComment('')
    setRejectReason('')
    setIsModalOpen(true)
  }

  const closeModal = useCallback(() => {
    setIsModalOpen(false)
    setModalAction(null)
    setSelectedProperty(null)
  }, [])

  const triggerPropertyAction = useCallback(
    async (propertyId: string, action: 'approve' | 'reject', data?: { comment?: string; rejectReason?: string }) => {
      try {
        setPendingActionPropertyId(propertyId)
        await handlePropertyAction(propertyId, reviewerId, action, data)
      } finally {
        setPendingActionPropertyId(null)
      }
    },
    [handlePropertyAction, reviewerId],
  )

  const handleModalConfirm = useCallback(async () => {
    if (!modalAction || !selectedProperty) return
    await triggerPropertyAction(selectedProperty.id, modalAction, { comment, rejectReason })
    closeModal()
  }, [modalAction, selectedProperty, comment, rejectReason, triggerPropertyAction, closeModal])

  const changePage = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)))

  const { pendingCount, rejectedCount } = useMemo(() => {
    const pending = properties?.filter(p => p.approval_status === 'UNDER_REVIEW').length || 0
    const rejected = properties?.filter(p => p.approval_status === 'REJECTED').length || 0
    return { pendingCount: pending, rejectedCount: rejected }
  }, [properties])
  const isEmptyTab = (activeTab === 'pending' ? pendingCount : rejectedCount) === 0

  const handleFavorite = async (propertyId: string) => {
    const isFav = favoritedProperties.has(propertyId)
    try {
      const response = isFav
        ? await deleteMethod(appEndpoints.deleteFavorite(reviewerId))
        : await postMethod(appEndpoints.toggleFavorite, { entity_type: 'property', entity_id: propertyId })

      if (!response?.error) {
        setFavoritedProperties(prev => {
          const newSet = new Set(prev)
          isFav ? newSet.delete(propertyId) : newSet.add(propertyId)
          return newSet
        })
      }
      mutateProperties()
    } catch (err) {
      console.error('Error updating favorite:', err)
    }
  }

  if (isLoading) return <CustomLoader text="property loading..." />
  if (error) return <div className="p-6 text-red-600">Failed to load properties.</div>

  return (
    <div className="w-full p-10">
      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200 pb-3 flex flex-wrap gap-2">
        {tabs.map(tab => {
          const isActive = tab.key === activeTab
          return (
            <Button
              key={tab.key}
              onClick={() => {
                // When switching tabs, reset pagination to first page so results start from page 1
                setActiveTab(tab.key)
                setCurrentPage(1)
              }}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition focus:ring-2 focus:ring-offset-2 ${
                isActive ? 'border-[#7B1E1E] bg-[#7B1E1E] text-white' : 'border-gray-200 text-gray-700 hover:text-[#7B1E1E]'
              }`}
            >
              {tab.label === 'Pending' ? `Pending (${pendingCount ?? '...'})` : `Rejected (${rejectedCount ?? '...'})`}
            </Button>
          )
        })}
      </div>

      {/* Info Text */}
      <div className="text-sm text-gray-600 mb-4 text-center">
        {isEmpty ? (
          'No properties found.'
        ) : isEmptyTab ? (
          'No properties found in this tab.'
        ) : (
          <span className="text-left block">
            Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, totalItems)} of {totalItems}
          </span>
        )}
      </div>

      {/* Property List */}
      {isEmpty ? (
        <div className="rounded-md border border-dashed border-gray-200 bg-white p-12 text-center text-gray-500">No properties available.</div>
      ) : (
        <div className="grid gap-6 md:grid-cols xl:grid-cols">
          {properties
            ?.filter(p => {
              if (activeTab === 'pending') return p.approval_status === 'UNDER_REVIEW'
              if (activeTab === 'rejected') return p.approval_status === 'REJECTED'
              return true
            })
            .map((property, i) => (
              <PropertyCard
                key={property.id ?? i}
                {...property}
                language={t}
                primaryActionLabel="Approve"
                secondaryActionLabel="Reject"
                onPrimaryAction={() => openModal(property, 'approve')}
                onSecondaryAction={() => openModal(property, 'reject')}
                primaryActionDisabled={pendingActionPropertyId === property.id}
                secondaryActionDisabled={pendingActionPropertyId === property.id}
                handleFavorite={handleFavorite}
                handleShare={() => console.log('Share', property.id)}
                isFavorited={favoritedProperties.has(property.id)}
              />
            ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination totalItems={totalItems} itemsPerPage={PAGE_SIZE} currentPage={currentPage} onPageChange={changePage} />
        </div>
      )}

      {/* Modal */}
      <ModalComponent
        open={isModalOpen}
        onClose={closeModal}
        title={modalAction === 'approve' ? 'Approve Property' : 'Reject Property'}
        footer={
          <>
            <Button onClick={closeModal} className="border px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Cancel
            </Button>
            <Button
              onClick={handleModalConfirm}
              disabled={!modalAction || !selectedProperty || pendingActionPropertyId === selectedProperty?.id}
              className="bg-[#7B1E1E] px-4 py-2 text-sm text-white hover:bg-[#661919] disabled:bg-gray-400"
            >
              Confirm
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-sm text-gray-600">
          <p>
            Are you sure you want to <span className="font-semibold">{modalAction}</span> the property{' '}
            <span className="font-semibold">{selectedProperty?.title ?? 'this listing'}</span>?
          </p>

          {modalAction === 'approve' && (
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm focus:border-[#7B1E1E] focus:ring-[#7B1E1E]"
              placeholder="Add approval notes (optional)..."
              rows={3}
            />
          )}

          {modalAction === 'reject' && (
            <>
              <select
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                className="w-full rounded-md border px-3 py-2 text-sm focus:border-[#7B1E1E] focus:ring-[#7B1E1E]"
              >
                <option value="">Select a reason</option>
                <option value="incomplete_information">Incomplete Information</option>
                <option value="invalid_documents">Invalid Documents</option>
                <option value="property_not_eligible">Property Not Eligible</option>
                <option value="other">Other</option>
              </select>

              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                className="w-full rounded-md border px-3 py-2 text-sm focus:border-[#7B1E1E] focus:ring-[#7B1E1E]"
                placeholder="Add rejection comments (optional)..."
                rows={3}
              />
            </>
          )}
        </div>
      </ModalComponent>
    </div>
  )
}

export default PropertiesPage
