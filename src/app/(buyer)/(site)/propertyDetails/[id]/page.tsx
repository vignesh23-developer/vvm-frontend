'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Heart, Share2, MessageSquare, Flag, MapPin, Eye, Phone, BarChart3, ArrowRight, Home, Ruler, BadgeCheck, IndianRupee } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Amenities from '@/components/buyer/Amenities/Amenities'
import { useTranslations } from 'next-intl'
import { useAuth } from '@/hooks/AuthContext/AuthContextProvider'
import { motion, Variants } from 'framer-motion'
import Button from '@/components/ui/CustomComponent/Button/Button'
import ReportPropertyModal from './modal/ReportPropertyModal'
import usePropertiesDetail from '../(hooks)/usePropertiesHook'
import MapView from '@/components/ui/map/MapView'
import ImageViewer from '@/components/ui/CustomComponent/ImageGallery/ImageGallery'
import FavoriteButton from '@/components/ui/CustomComponent/FavoriteButton/FavoriteButton'
import { appEndpoints } from '@/services/endpoints'
import { postMethod } from '@/services/service'
import EnquiryPropertyModal from './modal/EnquiryPropertyModal'
import CustomLoader from '@/components/ui/CustomComponent/Loader/CustomLoader'
import { formatPrice } from '@/utils/converter/formatPrice'
import ApproveOrRejectPropertyModal from '@/components/ui/CustomComponent/Modal/ApproveOrReject/ApproveOrRejectModal'

// Reusable animation variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2,
    },
  },
}
const page = () => {
  const t = useTranslations()
  const { user } = useAuth()
  const params = useParams<{ id: string | string[] }>()
  const propertyIdParam = params?.id
  const propertyId = Array.isArray(propertyIdParam) ? propertyIdParam[0] : propertyIdParam
  const [reportModalOpen, setReportModalOpen] = useState(false)
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false)
  const [approveOrRejectModalOpen, setApproveOrRejectModalOpen] = useState(false)
  const [approveOrRejectReason, setApproveOrRejectReason] = useState<string>('')
  const { propertyDetailsData, propertyDetailsFetchLoader, propertyDetailsFetchErr, propertyDetailsRefresh } = usePropertiesDetail({ id: propertyId })

  // Show full owner contact only when user is available; otherwise mask with 'xxx'
  const ownerNameDisplay = user ? propertyDetailsData?.contact_name ?? 'Unknown' : 'xxxxx'
  const ownerPhoneDisplay = user ? propertyDetailsData?.contact_phone ?? 'Unknown' : 'xxxxx'

  const handleFavorite = async (propertyId: string) => {
    try {
      const response = await postMethod(appEndpoints.toggleFavorite, { entity_type: 'property', entity_id: propertyId })
      propertyDetailsRefresh()
    } catch (err) {
      console.error('Error updating favorite:', err)
    }
  }

  const ReportDetails = [
    {
      label: 'Number of Reports',
      value: propertyDetailsData?.reports.length || 0,
      color: 'bg-[#FEE2E2]',
      iconColor: 'text-[#DC2626]',
      icon: <BarChart3 size={18} />,
      href: '/admin/dashboard/property-reports',
    },
    {
      label: 'Total Enquiries',
      value: 48,
      color: 'bg-[#DBEAFE]',
      iconColor: 'text-[#2563EB]',
      icon: <MessageSquare size={18} />,
      href: '/admin/dashboard/property-enquiry',
    },
    {
      label: 'Page Views',
      value: propertyDetailsData?.view_count || 0,
      color: 'bg-[#DCFCE7]',
      iconColor: 'text-[#16A34A]',
      icon: <Eye size={18} />,
      href: '#',
    },
  ]

  const mediaUrls = propertyDetailsData?.media?.map(item => item.url).filter(Boolean) as string[] | undefined
  const galleryImages = mediaUrls && mediaUrls.length > 0 ? mediaUrls : ['/villa.png']

  type HighlightItem = {
    label: string
    value: string
    accent: string
    Icon: LucideIcon
  }

  const propertyHighlights: HighlightItem[] = [
    {
      label: t('PropertiesDetails.super_built_up_area'),
      value: `${propertyDetailsData?.property_size ?? '--'} ${propertyDetailsData?.property_size_unit ?? ''}`.trim(),
      accent: 'bg-indigo-100 text-indigo-600',
      Icon: Ruler,
    },
    {
      label: t('PropertiesDetails.listing_type'),
      value: propertyDetailsData?.listing_type ?? '—',
      accent: 'bg-sky-100 text-sky-600',
      Icon: Home,
    },
    {
      label: t('PropertiesDetails.price'),
      value: `₹ ${formatPrice(propertyDetailsData?.price)}`,
      accent: 'bg-amber-100 text-amber-600',
      Icon: IndianRupee,
    },
    {
      label: t('PropertiesDetails.status'),
      value: propertyDetailsData?.status ?? '—',
      accent: 'bg-emerald-100 text-emerald-600',
      Icon: BadgeCheck,
    },
  ]

  if (propertyDetailsFetchErr) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center bg-gray-50">
        <p className="text-red-600 text-sm md:text-base">
          {/* {t('PropertiesDetails.load_error', {
            defaultValue: 'Unable to load property details right now. Please try again later.',
          })} */}
        </p>
      </main>
    )
  }

  // if (!propertyDetailsData) {
  //   return (
  //     <main className="flex min-h-[50vh] items-center justify-center bg-gray-50">
  //       <p className="text-gray-600 text-sm md:text-base">{t('PropertiesDetails.not_found', { defaultValue: 'Property details not available.' })}</p>
  //     </main>
  //   )
  // }

  if (propertyDetailsFetchLoader) {
    return <CustomLoader text="Loading property details..." />
  }

  return (
    <motion.main initial="hidden" animate="visible" variants={staggerContainer} className="w-full bg-gray-50 py-8 px-4 md:px-10">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
        {/* Left Content */}

        <motion.div variants={fadeInUp} className="lg:col-span-2 space-y-8">
          {/* Property Card */}
          <motion.div className="relative overflow-hidden rounded-3xl border border-gray-100 bg-gradient-to-br from-white via-white to-rose-50 shadow-2xl">
            <div className="absolute -top-28 -right-24 h-64 w-64 rounded-full bg-rose-200 opacity-30 blur-3xl" aria-hidden />
            <div className="relative flex flex-col gap-8 p-6 sm:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-5">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-rose-600 shadow-sm">
                      {propertyDetailsData?.listing_type ?? 'Listing'}
                    </span>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-600 shadow-sm">
                      {propertyDetailsData?.status ?? 'Status'}
                    </span>
                    <span className="flex items-center gap-1 rounded-full bg-rose-100 px-3 py-1 text-xs font-medium text-rose-600 shadow-sm">
                      <Heart className="h-3.5 w-3.5" />
                      {propertyDetailsData?.favorite_count ?? 0}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h1 className="text-3xl font-semibold text-gray-900 md:text-4xl">{propertyDetailsData?.title}</h1>
                    <p className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                      <MapPin size={16} className="text-rose-400" />
                      {propertyDetailsData?.address_line || t('PropertiesDetails.location', { defaultValue: 'Location not provided' })}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-4">
                  <div className="rounded-2xl border border-white/60 bg-white/80 px-5 py-4 text-right shadow-lg backdrop-blur">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{t('PropertiesDetails.price')}</p>
                    <p className="text-3xl font-bold text-gray-900">₹ {formatPrice(propertyDetailsData?.price)}</p>
                    <p className="text-xs text-gray-500">
                      {propertyDetailsData?.property_size
                        ? `${propertyDetailsData?.property_size} ${propertyDetailsData?.property_size_unit ?? ''}`
                        : t('PropertiesDetails.super_built_up_area')}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 200, damping: 12 }}>
                      <FavoriteButton
                        propertyId={propertyId}
                        isUserFavorited={propertyDetailsData?.is_user_favorite}
                        onToggleFavorite={handleFavorite}
                        size={28}
                        favoriteCount={propertyDetailsData?.favorite_count}
                      />
                    </motion.div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-md transition hover:text-rose-500"
                      aria-label="Share property"
                    >
                      <Share2 size={18} />
                    </motion.button>
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white shadow-xl">
                <ImageViewer images={galleryImages} />
              </div>

              <motion.div variants={fadeInUp} className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {propertyHighlights.map((item, idx) => {
                  const Icon = item.Icon
                  return (
                    <motion.div
                      key={`${item.label}-${idx}`}
                      whileHover={{ y: -4 }}
                      className="group flex items-start gap-3 rounded-2xl border border-gray-100 bg-white/80 p-4 shadow-sm backdrop-blur"
                    >
                      <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.accent}`}>
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{item.label}</p>
                        <p className="text-base font-semibold text-gray-900">{item.value}</p>
                      </div>
                    </motion.div>
                  )
                })}
              </motion.div>

              <motion.div variants={fadeInUp} className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-md backdrop-blur">
                <h2 className="text-lg font-semibold text-gray-900">{t('PropertiesDetails.description')}</h2>
                <p className="mt-3 text-sm leading-relaxed text-gray-700">{propertyDetailsData?.description}</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Amenities */}
          <motion.div variants={fadeInUp} whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 40 }} transition={{ duration: 0.6 }}>
            <Amenities title={t('PropertiesDetails.amenities')} PropertyAmenities={propertyDetailsData?.feature_values} />
          </motion.div>
          {/* Map Section */}
          <motion.div variants={fadeInUp} whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 40 }} transition={{ duration: 0.6 }}>
            <div className="rounded-3xl border border-gray-100 bg-white/90 p-4 shadow-md backdrop-blur">
              <div className="h-100 w-full overflow-hidden rounded-2xl">
                <MapView
                  center={{ lat: Number(propertyDetailsData?.latitude) || 12.9177477, lng: Number(propertyDetailsData?.longitude) || 80.2209669 }}
                  zoom={14}
                  markers={[{ lat: Number(propertyDetailsData?.latitude) || 12.9177477, lng: Number(propertyDetailsData?.longitude) || 80.2209669 }]}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Sidebar */}
        <motion.aside
          variants={fadeInUp}
          className="space-y-6"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Approve / Reject Section */}
          {propertyDetailsData?.approval_status === 'UNDER_REVIEW' && (
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md 
             flex flex-col gap-5 w-full max-w-xl mx-auto"
            >
              {/* Title */}
              <h2 className="text-lg font-semibold text-gray-800 text-center">Approve or Reject the Property</h2>

              {/* Buttons */}
              <div className="flex items-center justify-center gap-6">
                {/* Approve Button */}
                <motion.div whileTap={{ scale: 0.95 }}>
                  <Button
                    type="button"
                    onClick={() => {
                      setApproveOrRejectModalOpen(true)
                      setApproveOrRejectReason('approve')
                    }}
                    className="px-6 py-2.5 rounded-lg border border-green-600 
                 text-green-700 font-medium shadow-sm
                 hover:bg-green-600 hover:text-white transition-all 
                 active:scale-95"
                  >
                    Approve
                  </Button>
                </motion.div>

                {/* Reject Button */}
                <motion.div whileTap={{ scale: 0.95 }}>
                  <Button
                    type="button"
                    onClick={() => {
                      setApproveOrRejectModalOpen(true)
                      setApproveOrRejectReason('reject')
                    }}
                    className="px-6 py-2.5 rounded-lg border border-red-600 
                 text-red-600 font-medium shadow-sm
                 hover:bg-red-600 hover:text-white transition-all 
                 active:scale-95"
                  >
                    Reject
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Contact Owner */}
          <motion.div whileHover={{ scale: 1.03 }} className="bg-white shadow-md rounded-xl p-6 ">
            <h3 className="text-lg font-bold mb-2">{t('PropertiesDetails.contact_owner')}</h3>
            <p className="text-gray-700 gap-2 font-medium">
              <MessageSquare size={18} className="inline mr-2" /> {ownerNameDisplay}
            </p>
            <p className="text-gray-700 gap-2 font-medium mb-4">
              {' '}
              <Phone size={18} className="inline mr-2" /> {ownerPhoneDisplay}
            </p>

            <div className="space-y-3">
              <motion.div
                whileHover={{
                  scale: 1.05,
                  backgroundColor: '#3B2B2A',
                }}
                transition={{ duration: 0.3 }}
              >
                <Button
                  type="button"
                  onClick={() => {}}
                  className="w-full bg-[#4E3B39] text-white px-4 py-2 rounded-lg shadow-md transition font-medium"
                >
                  {t('PropertiesDetails.view_contact') || 'View Contact'}
                </Button>
              </motion.div>

              <motion.div
                whileHover={{
                  scale: 1.05,
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-center gap-2 text-white px-2 py-2 transition font-medium">
                  <Button
                    type="button"
                    onClick={() => setReportModalOpen(true)}
                    className="w-full bg-[#A21B1B] text-white px-4 py-2 rounded-lg shadow-md transition font-medium"
                  >
                    <Flag size={18} className="inline mr-2" />
                    {t('PropertiesDetails.report_property') || 'Report'}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setEnquiryModalOpen(true)}
                    className="w-full bg-[#2563EB] text-white px-4 py-2 rounded-lg shadow-md transition font-medium"
                  >
                    <MessageSquare size={18} className="inline mr-2" />
                    {t('PropertiesDetails.enquire_property') || 'Enquire'}
                  </Button>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Reports and Enquiries */}
          <motion.div whileHover={{ scale: 1.01 }} className="bg-white shadow-md rounded-xl p-6">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Property Insights</h3>
              <span className="text-xs font-medium uppercase tracking-wide text-gray-400">View details</span>
            </div>
            <div className="space-y-3">
              {ReportDetails?.map((item, idx) => (
                <Link href={item.href} key={idx} className="block">
                  <motion.div
                    whileHover={{ x: 4 }}
                    className="group flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 shadow-sm transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl shadow ${item.color} ${item.iconColor}`}>
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{item.label}</p>
                        <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-gray-500" />
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
          {/* Video Section */}
          <motion.div
            variants={fadeInUp}
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.6 }}
            className="bg-white shadow-md rounded-xl overflow-hidden"
          >
            <iframe
              className="w-full h-64 rounded-lg"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Property Video"
              allowFullScreen
            ></iframe>
          </motion.div>
        </motion.aside>

        <ApproveOrRejectPropertyModal
          approveOrRejectModalOpen={approveOrRejectModalOpen}
          setApproveOrRejectModalOpen={setApproveOrRejectModalOpen}
          approveOrRejectReason={approveOrRejectReason}
          userId={user ? user?.id : ''}
          property={propertyDetailsData ? propertyDetailsData : ''}
          propertyDetailsRefresh={propertyDetailsRefresh}
        />

        <ReportPropertyModal
          reportModalOpen={reportModalOpen}
          setReportModalOpen={setReportModalOpen}
          propertyId={propertyId ? String(propertyId) : ''}
        />

        <EnquiryPropertyModal
          EnquiryModalOpen={enquiryModalOpen}
          setEnquiryModalOpen={setEnquiryModalOpen}
          propertyId={propertyId ? String(propertyId) : ''}
        />
      </div>
    </motion.main>
  )
}

export default page
