'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { Heart, Share2, MessageSquare, Flag, MapPin } from 'lucide-react'
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

const imagesValue = [
  { src: '/villa.png', alt: 'Villa Image 1' },
  { src: '/property2.png', alt: 'Property Image 2' },
  { src: '/property3.png', alt: 'Property Image 3' },
  { src: '/property1.png', alt: 'Property Image 1' },
]

const page = () => {
  const t = useTranslations()
  const params = useParams<{ id: string | string[] }>()
  const propertyIdParam = params?.id
  const propertyId = Array.isArray(propertyIdParam) ? propertyIdParam[0] : propertyIdParam
  const [favoritedProperties, setFavoritedProperties] = useState<Set<string>>(new Set())
  const [reportModalOpen, setReportModalOpen] = useState(false)
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false)
  const { propertyDetailsData, propertyDetailsFetchLoader, propertyDetailsFetchErr, propertyDetailsRefresh } = usePropertiesDetail({ id: propertyId })

  const handleFavorite = async (propertyId: string) => {
    const isFav = favoritedProperties.has(propertyId)
    try {
      const response = isFav
        ? await deleteMethod(appEndpoints.deleteFavorite(propertyId))
        : await postMethod(appEndpoints.toggleFavorite, { entity_type: 'property', entity_id: propertyId })

      if (!response?.error) {
        setFavoritedProperties(prev => {
          const newSet = new Set(prev)
          isFav ? newSet.delete(propertyId) : newSet.add(propertyId)
          return newSet
        })
      }
      propertyDetailsRefresh()
    } catch (err) {
      console.error('Error updating favorite:', err)
    }
  }

  if (propertyDetailsFetchLoader) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-sm md:text-base">{t('PropertiesDetails.loading', { defaultValue: 'Loading property details…' })}</p>
      </main>
    )
  }

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

  if (!propertyDetailsData) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-sm md:text-base">{t('PropertiesDetails.not_found', { defaultValue: 'Property details not available.' })}</p>
      </main>
    )
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
                <p className="text-gray-800 mt-2">₹ {propertyDetailsData?.price}</p>
                <p className="text-sm text-gray-500">₹19,465 per sqft</p>
              </motion.div>

              <motion.div className="flex gap-3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                <motion.div whileHover={{ scale: 1.2, color: '#ef4444' }} className="p-2 rounded-full hover:bg-gray-100 transition">
                  <FavoriteButton
                    propertyId={propertyId}
                    isFavorited={favoritedProperties.has(propertyId)}
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
                <ImageViewer images={imagesValue.map(img => img.src)} />
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
                [t('PropertiesDetails.status'), `${propertyDetailsData?.status}`],
                [t('PropertiesDetails.purpose'), `${propertyDetailsData?.listing_type}`],
                [t('PropertiesDetails.price'), `₹ ${propertyDetailsData?.price}`],
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
            <Amenities title={t('PropertiesDetails.amenities')} />
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
          {/* Contact Owner */}
          <motion.div whileHover={{ scale: 1.03 }} className="bg-white shadow-md rounded-xl p-6">
            <h3 className="text-lg font-bold mb-2">{t('PropertiesDetails.contact_owner')}</h3>
            <p className="text-gray-700 font-medium">
              {t('PropertiesDetails.name')}: {propertyDetailsData?.contact_name || 'Unknown'}
            </p>
            <p className="text-gray-700 mb-4">{propertyDetailsData?.contact_phone || 'Unknown'}</p>

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
                  {t('PropertiesDetails.contact_owner')}
                </Button>
              </motion.div>

              <motion.div
                whileHover={{
                  scale: 1.05,
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-center gap-2 text-white px-4 py-2 rounded-lg shadow-md transition font-medium">
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

          {/* Agents */}
          <motion.div whileHover={{ scale: 1.03 }} className="bg-white shadow-md rounded-xl p-6">
            {[
              ['SD', t('PropertiesDetails.agent') + ' 1', 'bg-blue-500'],
              ['S', t('PropertiesDetails.agent') + ' 2', 'bg-indigo-500'],
            ].map(([initials, name, color], idx) => (
              <motion.div key={idx} className={`flex items-center space-x-3 mb-4 last:mb-0`} whileHover={{ x: 5 }}>
                <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center text-white font-bold`}>{initials}</div>
                <p className="font-medium text-gray-700">{name}</p>
              </motion.div>
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
