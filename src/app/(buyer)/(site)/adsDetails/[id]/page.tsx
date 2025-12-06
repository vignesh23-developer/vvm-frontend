'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/AuthContext/AuthContextProvider'
import { motion, Variants } from 'framer-motion'
import { Share2, Flag, MessageSquare, MapPin, Phone, Mail, Eye, BarChart3, MessageSquareMore } from 'lucide-react'
import toast from 'react-hot-toast'

import Button from '@/components/ui/CustomComponent/Button/Button'
import CustomLoader from '@/components/ui/CustomComponent/Loader/CustomLoader'
import ModalComponent from '@/components/ui/CustomComponent/Modal/ModalComponent'
import FavoriteButton from '@/components/ui/CustomComponent/FavoriteButton/FavoriteButton'
import MapView from '@/components/ui/map/MapView'
import ImageViewer from '@/components/ui/CustomComponent/ImageGallery/ImageGallery'
import { formatPrice } from '@/utils/converter/formatPrice'
import { useAdDetails } from '@/app/(buyer)/(site)/adsDetails/(hooks)/useAdDetails'
import { appEndpoints } from '@/services/endpoints'
import { postMethod } from '@/services/service'

import ReportAdModal from './modal/ReportAdModal'
import EnquiryAdModal from './modal/EnquiryAdModal'
import { getUserRoles, hasRole, Roles } from '@/utils/roles/roles'

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
}

const AdsDetailsPage = () => {
  const params = useParams<{ id: string | string[] }>()
  const router = useRouter()
  const { user } = useAuth()
  const userRoles = getUserRoles(user)
  const onlyAdmin = hasRole(userRoles, [Roles.ADMIN])

  const adIdParam = params?.id
  const adId = Array.isArray(adIdParam) ? adIdParam[0] : adIdParam

  const [reportModalOpen, setReportModalOpen] = useState(false)
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false)
  const [approveModalOpen, setApproveModalOpen] = useState(false)
  const [approveAction, setApproveAction] = useState<'approve' | 'reject' | null>(null)
  const [approvalComment, setApprovalComment] = useState('')
  const [rejectReason, setRejectReason] = useState('')
  const [approvalSubmitting, setApprovalSubmitting] = useState(false)

  const { adDetails, adDetailsLoading, adDetailsError, adDetailsRefresh, handleAdApprovalAction } = useAdDetails({ id: adId })

  const reviewerId = user ? user?.id : null

  // Get primary images first, then fall back to all images
  const adImages = useMemo(() => {
    if (!adDetails?.images?.length) return []
    // Try to find primary images first
    const primaryImages = adDetails.images.filter(img => img.is_primary && img.url).map(img => img.url)

    // If no primary images, use all available images
    return primaryImages.length > 0 ? primaryImages : adDetails.images.map(img => img.url).filter(Boolean)
  }, [adDetails?.images])

  const formattedAddress = useMemo(
    () => [adDetails?.address_line, adDetails?.city, adDetails?.state].filter(Boolean).join(', '),
    [adDetails?.address_line, adDetails?.city, adDetails?.state],
  )

  useEffect(() => {
    if (!adId) {
      router.replace('/ads/list')
    }
  }, [adId, router])

  const stats = useMemo(
    () =>
      [
        {
          label: 'Number of Reports',
          value: adDetails?.reports_count ?? 0,
          color: 'bg-[#FEE2E2]',
          iconColor: 'text-[#DC2626]',
          icon: <BarChart3 size={18} />,
        },
        {
          label: 'Total Enquiries',
          value: adDetails?.contact_count ?? 0,
          color: 'bg-[#DBEAFE]',
          iconColor: 'text-[#2563EB]',
          icon: <MessageSquare size={18} />,
        },
        {
          label: 'Page Views',
          value: adDetails?.view_count ?? 0,
          color: 'bg-[#DCFCE7]',
          iconColor: 'text-[#16A34A]',
          icon: <Eye size={18} />,
        },
      ] as const,
    [adDetails],
  )

  const detailItems = useMemo(
    () => [
      { label: 'Category', value: adDetails?.category_id ?? '-' },
      { label: 'Status', value: adDetails?.status ?? '-' },
      { label: 'Approval', value: adDetails?.approval_status ?? '-' },
      {
        label: 'Price',
        value: adDetails?.price ? `₹ ${formatPrice(Number(adDetails.price))}` : '-',
      },
      { label: 'Negotiable', value: adDetails?.is_negotiable ? 'Yes' : 'No' },
      {
        label: 'Created On',
        value: adDetails?.created_at ? new Date(adDetails.created_at).toLocaleDateString() : '-',
      },
    ],
    [adDetails],
  )

  const handleFavorite = useCallback(
    async (adId: string) => {
      try {
        await postMethod(appEndpoints.toggleFavorite, { entity_type: 'ad', entity_id: adId })
        adDetailsRefresh()
      } catch (err) {
        console.error('Failed to toggle favorite', err)
      }
    },
    [adDetailsRefresh],
  )

  const handleShare = useCallback(() => {
    if (typeof window !== 'undefined') {
      navigator?.clipboard?.writeText(window.location.href)
      toast.success('Link copied to clipboard')
    }
  }, [])

  const openApproveModal = useCallback((action: 'approve' | 'reject') => {
    setApproveAction(action)
    setApprovalComment('')
    setRejectReason('')
    setApproveModalOpen(true)
  }, [])

  const closeApproveModal = useCallback(() => {
    setApproveModalOpen(false)
    setApproveAction(null)
  }, [])

  const handleApproveSubmit = useCallback(async () => {
    if (!adDetails || !approveAction || !reviewerId) return
    setApprovalSubmitting(true)
    const success = await handleAdApprovalAction(adDetails.id, reviewerId, approveAction, {
      comment: approvalComment,
      rejectReason,
    })
    setApprovalSubmitting(false)
    if (success) {
      closeApproveModal()
    }
  }, [adDetails, approveAction, reviewerId, handleAdApprovalAction, approvalComment, rejectReason, closeApproveModal])

  if (adDetailsLoading) {
    return <CustomLoader text="Loading ad details..." />
  }

  if (adDetailsError || !adDetails) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-gray-50 px-4">
        <div className="bg-white shadow-md rounded-2xl p-8 max-w-md w-full text-center">
          <p className="text-gray-700 text-lg font-medium mb-4">Unable to load ad details right now</p>

          <p className="text-gray-500 text-sm mb-6">Please check your connection or try again.</p>

          <Button onClick={() => adDetailsRefresh()} className="bg-[#2a1407] text-white px-6 py-2 rounded-lg hover:bg-[#8f2424] transition">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  // adImages and formattedAddress are now defined at the top with useMemo

  return (
    <motion.main initial="hidden" animate="visible" variants={staggerContainer} className="w-full bg-gray-50 py-8 px-4 mt-10 md:px-10">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
        <motion.section variants={fadeInUp} className="lg:col-span-2 space-y-8">
          <motion.div variants={fadeInUp} className="bg-white shadow-md rounded-xl overflow-hidden">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-100 px-6 py-5">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                <h1 className="text-2xl font-semibold text-gray-900">{adDetails.title}</h1>
                <p className="text-2xl font-bold text-gray-900 mt-1">₹ {formatPrice(Number(adDetails.price))}</p>
              </motion.div>

              <div className="flex items-center gap-3">
                <motion.div whileHover={{ scale: 1.05 }}>
                  <FavoriteButton
                    propertyId={adDetails.id}
                    isUserFavorited={adDetails?.is_user_favorite}
                    onToggleFavorite={handleFavorite}
                    size={28}
                    favoriteCount={adDetails?.favorite_count}
                  />
                </motion.div>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.2, color: '#2563eb' }}
                  onClick={handleShare}
                  className="p-2 rounded-full hover:bg-gray-100 transition"
                >
                  <Share2 size={20} />
                </motion.button>
              </div>
            </div>

            <div className="space-y-6 py-6">
              <motion.div className="relative w-full px-6" variants={fadeInUp}>
                {adImages.length ? (
                  <motion.div transition={{ duration: 0.25 }} className="relative rounded-xl overflow-hidden shadow-sm">
                    <ImageViewer images={adImages} />
                  </motion.div>
                ) : (
                  <div className="w-full h-[340px] flex items-center justify-center text-gray-500 text-sm bg-gray-100 rounded-xl">
                    No image available
                  </div>
                )}
              </motion.div>

              <div className="flex flex-wrap gap-2 text-sm text-gray-600 px-6">
                <span className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1">
                  <MapPin size={14} /> {formattedAddress || 'Address not available'}
                </span>
              </div>

              <motion.div variants={fadeInUp} className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 px-6 text-sm">
                {detailItems.map(info => (
                  <motion.div key={info.label} whileHover={{ scale: 1.03 }} className="rounded-xl bg-gray-50 p-4">
                    <p className="text-xs uppercase text-gray-500">{info.label}</p>
                    <p className="font-semibold text-gray-900 break-words">{info.value}</p>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div variants={fadeInUp} className="px-6">
                <div className="bg-white rounded-xl shadow-inner p-6 border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">{adDetails.description || 'No description provided.'}</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-3">Location</h3>
            <div className="w-full h-[320px] rounded-xl overflow-hidden border border-gray-100">
              <MapView
                center={{ lat: Number(adDetails.latitude) || 12.9177, lng: Number(adDetails.longitude) || 80.2209 }}
                zoom={13}
                markers={[{ lat: Number(adDetails.latitude) || 12.9177, lng: Number(adDetails.longitude) || 80.2209 }]}
              />
            </div>
          </motion.div>
        </motion.section>

        <motion.aside
          variants={fadeInUp}
          className="space-y-6"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {adDetails.approval_status === 'UNDER_REVIEW' && onlyAdmin && (
            <motion.div
              variants={fadeInUp}
              whileHover={{ scale: 1.01 }}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col gap-5"
            >
              <h3 className="text-lg font-semibold text-center">Approve or Reject the Ad</h3>
              <div className="flex items-center justify-center gap-6">
                <motion.div whileTap={{ scale: 0.95 }}>
                  <Button
                    type="button"
                    className="px-6 py-2.5 rounded-lg border border-green-600 text-green-700 font-medium shadow-sm hover:bg-green-600 hover:text-white transition-all"
                    onClick={() => openApproveModal('approve')}
                  >
                    Approve
                  </Button>
                </motion.div>
                <motion.div whileTap={{ scale: 0.95 }}>
                  <Button
                    type="button"
                    className="px-6 py-2.5 rounded-lg border border-red-600 text-red-600 font-medium shadow-sm hover:bg-red-600 hover:text-white transition-all"
                    onClick={() => openApproveModal('reject')}
                  >
                    Reject
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}

          <motion.div variants={fadeInUp} className="bg-white shadow-sm rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold">Contact Owner</h3>
            <p className="flex items-center gap-2 text-gray-700">
              <MessageSquareMore size={16} className="text-gray-400" /> {adDetails.contact_name || 'N/A'}
            </p>
            <p className="flex items-center gap-2 text-gray-700">
              <Phone size={16} className="text-gray-400" /> {adDetails.contact_phone || 'N/A'}
            </p>
            <p className="flex items-center gap-2 text-gray-700">
              <Mail size={16} className="text-gray-400" /> {adDetails.contact_email || 'N/A'}
            </p>

            <div className="space-y-3">
              <motion.div
                whileHover={{
                  scale: 1.05,
                  backgroundColor: '#3B2B2A',
                }}
                transition={{ duration: 0.3 }}
              >
                <Button className="w-full bg-[#4E3B39] text-white px-4 py-2 rounded-lg shadow-md transition font-medium" onClick={() => {}}>
                  View Contact
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                <div className="flex justify-between items-center gap-2 text-white px-2 py-2 transition font-medium">
                  <Button
                    className="w-full bg-[#A21B1B] text-white px-4 py-2 rounded-lg shadow-md transition font-medium"
                    onClick={() => setReportModalOpen(true)}
                  >
                    <Flag size={18} className="inline mr-2" /> Report
                  </Button>
                  <Button
                    className="w-full bg-[#2563EB] text-white px-4 py-2 rounded-lg shadow-md transition font-medium"
                    onClick={() => setEnquiryModalOpen(true)}
                  >
                    <MessageSquare size={18} className="inline mr-2" /> Enquire
                  </Button>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
            {stats.map(stat => (
              <motion.div key={`${stat.label}-sidebar`} whileHover={{ x: 4 }} className="flex items-center gap-3">
                <span className={`w-10 h-10 rounded-full flex items-center justify-center ${stat.color} ${stat.iconColor}`}>{stat.icon}</span>
                <div>
                  <p className="text-xs uppercase text-gray-500">{stat.label}</p>
                  <p className="text-lg font-semibold">{stat.value}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.aside>
      </div>

      <ReportAdModal open={reportModalOpen} onClose={() => setReportModalOpen(false)} adId={adDetails.id} />
      <EnquiryAdModal open={enquiryModalOpen} onClose={() => setEnquiryModalOpen(false)} adId={adDetails.id} />

      <ModalComponent
        open={approveModalOpen}
        onClose={closeApproveModal}
        title={approveAction === 'approve' ? 'Approve Ad' : 'Reject Ad'}
        footer={
          <div className="flex justify-end gap-3">
            <Button className="border px-4 py-2 text-sm" onClick={closeApproveModal} disabled={approvalSubmitting}>
              Cancel
            </Button>
            <Button className="bg-[#2a1407] text-white px-4 py-2 text-sm" onClick={handleApproveSubmit} disabled={approvalSubmitting}>
              {approvalSubmitting ? 'Processing...' : 'Confirm'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4 text-sm text-gray-700">
          <p>
            Are you sure you want to <span className="font-semibold">{approveAction}</span> the ad{' '}
            <span className="font-semibold">{adDetails.title}</span>?
          </p>

          {approveAction === 'reject' && (
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
    </motion.main>
  )
}

export default AdsDetailsPage
