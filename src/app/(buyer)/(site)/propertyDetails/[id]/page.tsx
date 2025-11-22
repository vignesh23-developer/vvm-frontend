'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Heart, Share2, MessageSquare, Flag, MapPin, Eye, BarChart3 } from 'lucide-react'
import Amenities from '@/components/buyer/Amenities/Amenities'
import { useTranslations } from 'next-intl'
import { motion, Variants } from 'framer-motion'
import Button from '@/components/ui/CustomComponent/Button/Button'
import ReportPropertyModal from './modal/ReportPropertyModal'
import usePropertiesDetail from '../(hooks)/usePropertiesHook'
import MapView from '@/components/ui/map/MapView'
import ImageViewer from '@/components/ui/CustomComponent/ImageGallery/ImageGallery'
import FavoriteButton from '@/components/ui/CustomComponent/FavoriteButton/FavoriteButton'
import { appEndpoints } from '@/services/endpoints'
import { deleteMethod, postMethod } from '@/services/service'
import EnquiryPropertyModal from './modal/EnquiryPropertyModal'
import { getLocalStorageItem } from '@/utils/local_storage/local_storage_handler'
import { LOCAL_STORAGE_NAME } from '@/utils/local_storage/local_storage_constant'
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
interface userData {
  id: string
  firstName: string
  lastName: string
  email: string
}
const page = () => {
  const t = useTranslations()
  const params = useParams<{ id: string | string[] }>()
  const propertyIdParam = params?.id
  const propertyId = Array.isArray(propertyIdParam) ? propertyIdParam[0] : propertyIdParam
  const [reportModalOpen, setReportModalOpen] = useState(false)
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false)
  const [approveOrRejectModalOpen, setApproveOrRejectModalOpen] = useState(false)
  const [approveOrRejectReason, setApproveOrRejectReason] = useState<string>('')
  const { propertyDetailsData, propertyDetailsFetchLoader, propertyDetailsFetchErr, propertyDetailsRefresh } = usePropertiesDetail({ id: propertyId })
  const [userValue, setUserValue] = useState<userData | null>(null)

  useEffect(() => {
    const storedUser = getLocalStorageItem(LOCAL_STORAGE_NAME.userData) as userData
    if (storedUser) {
      setUserValue(storedUser)
    }
  }, [])

  // Show full owner contact only when user is available; otherwise mask with 'xxx'
  const ownerNameDisplay = userValue ? propertyDetailsData?.contact_name ?? 'Unknown' : 'xxxxx'
  const ownerPhoneDisplay = userValue ? propertyDetailsData?.contact_phone ?? 'Unknown' : 'xxxxx'

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
      color: 'bg-rose-500',
      icon: <BarChart3 className="w-5 h-5 text-white" />,
      href: '/admin/dashboard/property-reports',
    },
    {
      label: 'Total Enquiries',
      value: 48,
      color: 'bg-blue-500',
      icon: <MessageSquare className="w-5 h-5 text-white" />,
      href: '/admin/dashboard/property-enquiry',
    },
    {
      label: 'Page Views',
      value: propertyDetailsData?.view_count || 0,
      color: 'bg-green-500',
      icon: <Eye className="w-5 h-5 text-white" />,
      href: '#',
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
          <motion.div className="bg-white shadow-md rounded-xl overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-start p-5">
              <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                <h1 className="text-xl font-semibold">{propertyDetailsData?.title}</h1>
                <p className="text-gray-800 mt-2">₹ {formatPrice(propertyDetailsData?.price)}</p>
                <p className="text-sm text-gray-500">
                  {propertyDetailsData?.property_size} {propertyDetailsData?.property_size_unit}
                </p>
              </motion.div>

              <motion.div className="flex gap-3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 200, damping: 12 }} className="inline-block">
                  <FavoriteButton
                    propertyId={propertyId}
                    isUserFavorited={propertyDetailsData?.is_user_favorite}
                    onToggleFavorite={handleFavorite}
                    size={25}
                    favoriteCount={propertyDetailsData?.favorite_count}
                  />
                </motion.div>

                <motion.button whileHover={{ scale: 1.2, color: '#2563eb' }} className="p-2 rounded-full hover:bg-gray-100 transition">
                  <Share2 size={20} />
                </motion.button>
              </motion.div>
            </div>

            {/* Image Gallery */}
            <motion.div className="relative w-full flex gap-3 px-5" variants={fadeInUp}>
              <motion.div transition={{ duration: 0.25 }} className="relative flex-1 rounded-xl overflow-hidden shadow-sm">
                <ImageViewer images={propertyDetailsData?.media.map(img => img.url)} />
              </motion.div>
            </motion.div>

            {/* Address */}
            <div className="mt-5 flex gap-6 items-center px-5 pb-4 text-gray-600">
              <div className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded-full">
                <MapPin size={18} className="text-gray-400" />
                <p className="text-gray-800">{`${propertyDetailsData?.address_line || ''}`}</p>
              </div>
            </div>

            {/* Details Section */}
            <motion.div variants={fadeInUp} className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 p-6 text-sm">
              {[
                [t('PropertiesDetails.super_built_up_area'), `${propertyDetailsData?.property_size} ${propertyDetailsData?.property_size_unit}`],

                [t('PropertiesDetails.listing_type'), `${propertyDetailsData?.listing_type}`],
                [t('PropertiesDetails.price'), `₹ ${formatPrice(propertyDetailsData?.price)}`],
                [t('PropertiesDetails.status'), `${propertyDetailsData?.status}`],
              ].map(([label, value], idx) => (
                <motion.div key={idx} whileHover={{ scale: 1.03 }}>
                  <p className="text-gray-600">{label}</p>
                  <p className="font-semibold">{value}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Description */}
            <motion.div variants={fadeInUp} className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold mb-3">{t('PropertiesDetails.description')}</h2>
              <p className="text-gray-700 leading-relaxed text-justify text-sm">{propertyDetailsData?.description}</p>
            </motion.div>
          </motion.div>

          {/* Amenities */}
          <motion.div variants={fadeInUp} whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 40 }} transition={{ duration: 0.6 }}>
            <Amenities title={t('PropertiesDetails.amenities')} PropertyAmenities={propertyDetailsData?.feature_values} />
          </motion.div>
          {/* Map Section */}
          <motion.div variants={fadeInUp} whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 40 }} transition={{ duration: 0.6 }}>
            <div className="w-full h-100 rounded-xl overflow-hidden">
              <MapView
                center={{ lat: Number(propertyDetailsData?.latitude) || 12.9177477, lng: Number(propertyDetailsData?.longitude) || 80.2209669 }}
                zoom={14}
                markers={[{ lat: Number(propertyDetailsData?.latitude) || 12.9177477, lng: Number(propertyDetailsData?.longitude) || 80.2209669 }]}
              />
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
          <motion.div whileHover={{ scale: 1.03 }} className="bg-white shadow-md rounded-xl p-6">
            <h3 className="text-lg font-bold mb-2">{t('PropertiesDetails.contact_owner')}</h3>
            <p className="text-gray-700 font-medium">
              {t('PropertiesDetails.name')}: {ownerNameDisplay}
            </p>
            <p className="text-gray-700 mb-4">{ownerPhoneDisplay}</p>

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
          <motion.div whileHover={{ scale: 1.03 }} className="bg-white shadow-md rounded-xl p-6">
            {ReportDetails?.map((item, idx) => (
              <Link href={item.href} key={idx} className="block">
                <motion.div whileHover={{ x: 5 }} className="flex items-center space-x-4 mb-4 last:mb-0 cursor-pointer">
                  {/* Icon Circle */}
                  <div className={`w-10 h-10 rounded-full ${item.color} flex items-center justify-center shadow`}>{item.icon}</div>

                  {/* Text Block */}
                  <div>
                    <p className="text-sm font-semibold text-gray-700">{item.label}</p>
                    <p className="text-xl font-bold text-gray-900">{item.value}</p>
                  </div>
                </motion.div>
              </Link>
            ))}
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
          userId={userValue ? userValue?.id : ''}
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
