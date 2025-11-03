'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import PropertyCard from '@/components/buyer/PropertyCard/PropertyCard'
import { useProperties } from '@/app/admin/dashboard/properties/(Hooks)/useProperties'
import { useTranslations } from 'next-intl'
import ModalComponent from '@/components/ui/CustomComponent/Modal/ModalComponent'
import Button from '@/components/ui/CustomComponent/Button/Button'
import { PropertiesDto } from './(Dto)/propertiesDto'

type TabConfig = {
  key: string
  label: string
}

const PAGE_SIZE = 6
const MAX_PAGE_BUTTONS = 5

const PropertiesPage = () => {
  const t = useTranslations()
  const [activeTab, setActiveTab] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pendingActionPropertyId, setPendingActionPropertyId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<PropertiesDto | null>(null)
  const [modalAction, setModalAction] = useState<'approve' | 'reject' | null>(null)
  const [comment, setComment] = useState('')
  const [rejectReason, setRejectReason] = useState('')
  const { properties, total, isLoading, error, handlePropertyAction } = useProperties({ page: currentPage, limit: PAGE_SIZE })

  const openModal = (property: any, action: 'approve' | 'reject') => {
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

  const reviewer_id = 'cc98934f-d1f7-4e8d-8484-72d24f94b508'

  const triggerPropertyAction = useCallback(
    async (propertyId: string, action: 'approve' | 'reject', extraData?: { comment?: string; rejectReason?: string }) => {
      try {
        setPendingActionPropertyId(propertyId)
        await handlePropertyAction(propertyId, reviewer_id, action, extraData)
      } finally {
        setPendingActionPropertyId(null)
      }
    },
    [handlePropertyAction],
  )

  const actionLabel = modalAction === 'approve' ? 'approve' : modalAction === 'reject' ? 'reject' : 'perform this action on'

  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: total ?? properties.length,
    }

    properties.forEach(property => {
      const type = property.listing_type?.toUpperCase()
      if (!type) {
        return
      }
      counts[type] = (counts[type] ?? 0) + 1
    })

    return counts
  }, [properties, total])

  const tabs = useMemo<TabConfig[]>(() => {
    const uniqueListingTypes = Array.from(
      new Set(properties.map(property => property.listing_type?.toUpperCase()).filter((type): type is string => Boolean(type))),
    )

    const formatTabLabel = (value: string) =>
      value
        .toLowerCase()
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

    const dynamicTabs = uniqueListingTypes.map(type => ({
      key: type,
      label: formatTabLabel(type),
    }))

    return [{ key: 'all', label: 'All Listings' }, ...dynamicTabs]
  }, [properties])

  useEffect(() => {
    if (!tabs.some(tab => tab.key === activeTab)) {
      setActiveTab('all')
      setCurrentPage(1)
    }
  }, [tabs, activeTab])

  useEffect(() => {
    setCurrentPage(1)
  }, [activeTab])

  const filteredProperties = useMemo(() => {
    if (activeTab === 'all') {
      return properties
    }

    return properties.filter(property => property.listing_type?.toUpperCase() === activeTab)
  }, [activeTab, properties])

  const totalItems = activeTab === 'all' ? total ?? 0 : filteredProperties.length
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE))

  useEffect(() => {
    setCurrentPage(previous => Math.min(previous, totalPages))
  }, [totalPages])

  const startIndex = (currentPage - 1) * PAGE_SIZE
  const paginatedProperties = activeTab === 'all' ? properties : filteredProperties.slice(startIndex, startIndex + PAGE_SIZE)

  const startItem = totalItems === 0 ? 0 : startIndex + 1
  const endItem = totalItems === 0 ? 0 : Math.min(startIndex + paginatedProperties.length, totalItems)

  const visiblePages = useMemo(() => {
    if (totalPages <= MAX_PAGE_BUTTONS) {
      return Array.from({ length: totalPages }, (_, index) => index + 1)
    }

    const halfWindow = Math.floor(MAX_PAGE_BUTTONS / 2)
    let startPage = Math.max(1, currentPage - halfWindow)
    let endPage = startPage + MAX_PAGE_BUTTONS - 1

    if (endPage > totalPages) {
      endPage = totalPages
      startPage = endPage - MAX_PAGE_BUTTONS + 1
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index)
  }, [currentPage, totalPages])

  const isEmpty = totalItems === 0

  const selectTab = (key: string) => {
    setActiveTab(key)
  }

  const changePage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  if (isLoading) return <div className="p-6 text-gray-600 animate-pulse">Loading properties...</div>
  if (error) return <div className="p-6 text-red-600">Failed to load properties.</div>

  return (
    <div className="w-full p-10">
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-3">
          {tabs.map(tab => {
            const isActive = tab.key === activeTab
            const count = tabCounts[tab.key] ?? 0

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => selectTab(tab.key)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isActive
                    ? 'border-[#7B1E1E] bg-[#7B1E1E] text-white focus:ring-[#7B1E1E]'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-[#7B1E1E] hover:text-[#7B1E1E] focus:ring-gray-200'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        <div className="mt-4 text-sm text-gray-600">
          {isEmpty ? 'No properties found for the selected filter.' : `Showing ${startItem} to ${endItem} of ${totalItems} properties`}
        </div>
      </div>
      {isEmpty ? (
        <div className="rounded-md border border-dashed border-gray-200 bg-white p-12 text-center text-gray-500">
          No properties available for the selected tab.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols xl:grid-cols">
          {paginatedProperties.map((property, index) => {
            const key = property.id ?? property.slug ?? `property-${startIndex + index}`

            return (
              <PropertyCard
                key={key}
                {...property}
                language={t}
                primaryActionLabel="Approve"
                secondaryActionLabel="Reject"
                tertiaryActionText="Review before taking action"
                onPrimaryAction={() => openModal(property, 'approve')}
                onSecondaryAction={() => openModal(property, 'reject')}
                primaryActionDisabled={pendingActionPropertyId === property.id}
                secondaryActionDisabled={pendingActionPropertyId === property.id}
              />
            )
          })}
        </div>
      )}
      {totalPages > 1 && (
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-4 md:flex-row">
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => changePage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`rounded-md border px-3 py-1 text-sm font-medium transition ${
                currentPage === 1
                  ? 'cursor-not-allowed border-gray-200 text-gray-400'
                  : 'border-gray-200 text-gray-700 hover:border-[#7B1E1E] hover:text-[#7B1E1E]'
              }`}
            >
              Previous
            </button>

            {visiblePages.map(page => (
              <button
                key={page}
                type="button"
                onClick={() => changePage(page)}
                className={`rounded-md px-3 py-1 text-sm font-medium transition ${
                  page === currentPage
                    ? 'bg-[#7B1E1E] text-white shadow'
                    : 'border border-gray-200 text-gray-700 hover:border-[#7B1E1E] hover:text-[#7B1E1E]'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              onClick={() => changePage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`rounded-md border px-3 py-1 text-sm font-medium transition ${
                currentPage === totalPages
                  ? 'cursor-not-allowed border-gray-200 text-gray-400'
                  : 'border-gray-200 text-gray-700 hover:border-[#7B1E1E] hover:text-[#7B1E1E]'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
      <ModalComponent
        open={isModalOpen}
        onClose={closeModal}
        title={modalAction === 'approve' ? 'Approve Property' : modalAction === 'reject' ? 'Reject Property' : 'Confirm Action'}
        footer={
          <>
            <Button onClick={closeModal} className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Cancel
            </Button>
            <Button
              onClick={async () => {
                if (!modalAction || !selectedProperty) return

                await triggerPropertyAction(selectedProperty.id, modalAction, {
                  comment,
                  rejectReason,
                })
                closeModal()
              }}
              disabled={!modalAction || !selectedProperty || pendingActionPropertyId === selectedProperty.id}
              className="rounded-md bg-[#7B1E1E] px-4 py-2 text-sm text-white hover:bg-[#661919] disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              Confirm
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-sm text-gray-600">
          <p>
            Are you sure you want to <span className="font-semibold">{actionLabel}</span> the property{' '}
            <span className="font-semibold">{selectedProperty?.title ?? 'this listing'}</span>?
          </p>

          {/* 🟩 Approve Comment Box */}
          {modalAction === 'approve' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Add Comment (optional)</label>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#7B1E1E] focus:ring-[#7B1E1E]"
                placeholder="Add your approval notes..."
                rows={3}
              />
            </div>
          )}

          {/* 🟥 Reject Form: Reason + Comment */}
          {modalAction === 'reject' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Reason for Rejection</label>
                <select
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#7B1E1E] focus:ring-[#7B1E1E]"
                >
                  <option value="">Select a reason</option>
                  <option value="incomplete_information">Incomplete Information</option>
                  <option value="invalid_documents">Invalid Documents</option>
                  <option value="property_not_eligible">Property Not Eligible</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Add Comment (optional)</label>
                <textarea
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#7B1E1E] focus:ring-[#7B1E1E]"
                  placeholder="Add reason details or remarks..."
                  rows={3}
                />
              </div>
            </>
          )}
        </div>
      </ModalComponent>
    </div>
  )
}

export default PropertiesPage
