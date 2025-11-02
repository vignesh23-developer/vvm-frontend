'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { Heart, Share2, BedDouble, Bath, Building, Sofa, Flag } from 'lucide-react'
import Amenities from '@/components/buyer/Amenities/Amenities'
import { useTranslations } from 'next-intl'
import { motion, Variants } from 'framer-motion'
import Button from '@/components/ui/CustomComponent/Button/Button'
import ReportPropertyModal from './modal/ReportPropertyModal'
import usePropertiesDetail from '../(hooks)/usePropertiesHook'
import MapView from '@/components/ui/map/MapView'
import ImageViewer from '@/components/ui/CustomComponent/ImageGallery/ImageGallery'
const DEFAULT_MAIN_IMAGE = '/villa.png'
const DEFAULT_THUMB_IMAGE = '/agency.png'
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
  const [reportModalOpen, setReportModalOpen] = useState(false)
  const { propertyDetailsData, propertyDetailsFetchLoader, propertyDetailsFetchErr } = usePropertiesDetail({ id: propertyId })

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
          {t('PropertiesDetails.load_error', {
            defaultValue: 'Unable to load property details right now. Please try again later.',
          })}
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
          <motion.div
            variants={fadeInUp}
            whileHover={{ scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 120 }}
            className="bg-white shadow-md rounded-xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex justify-between items-start p-5">
              <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                <h2 className="text-xl font-semibold">₹ {propertyDetailsData?.price}</h2>
                <p className="text-sm text-gray-500">₹19,465 per sqft</p>
                <p className="text-gray-800 mt-2 font-medium">{propertyDetailsData?.title}</p>
              </motion.div>

              <motion.div className="flex gap-3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                <motion.button whileHover={{ scale: 1.2, color: '#ef4444' }} className="p-2 rounded-full hover:bg-gray-100 transition">
                  <Heart size={20} />
                </motion.button>
                <motion.button whileHover={{ scale: 1.2, color: '#2563eb' }} className="p-2 rounded-full hover:bg-gray-100 transition">
                  <Share2 size={20} />
                </motion.button>
              </motion.div>
            </div>

            {/* Image Gallery */}
            {/* <motion.div className="relative w-full flex gap-3 px-5 py-4" variants={fadeInUp}> */}
            {/* <motion.div transition={{ duration: 0.25 }} className="relative flex-1 rounded-xl overflow-hidden shadow-sm"> */}
            <ImageViewer images={imagesValue.map(img => img.src)} />
            {/* </motion.div> */}
            {/* </motion.div> */}

            {/* Property Info */}
            <motion.div variants={fadeInUp} className="flex flex-wrap items-center justify-between mt-4 bg-gray-100 rounded-lg p-2 text-sm">
              {[
                {
                  icon: <BedDouble className="w-4 h-4" />,
                  label: `3 ${t('PropertiesDetails.bed_rooms')}`,
                },
                {
                  icon: <Bath className="w-4 h-4" />,
                  label: `3 ${t('PropertiesDetails.bath_rooms')}`,
                },
                {
                  icon: <Building className="w-4 h-4" />,
                  label: `1 ${t('PropertiesDetails.balcony')}`,
                },
                {
                  icon: <Sofa className="w-4 h-4" />,
                  label: t('PropertiesDetails.semi_furnished'),
                },
              ].map((item, idx) => (
                <motion.div key={idx} whileHover={{ scale: 1.05 }} className="flex items-center gap-2 px-3 border-r border-gray-300 last:border-none">
                  {item.icon}
                  <span>{item.label}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Details Section */}
            <motion.div variants={fadeInUp} className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 p-6 text-sm">
              {[
                [t('PropertiesDetails.super_built_up_area'), '2000sqft'],
                [t('PropertiesDetails.floors'), 'Ground (Out of 3 Floors)'],
                [t('PropertiesDetails.parking'), 'Bike and Car'],
                [t('PropertiesDetails.age_of_building'), '>10 years'],
                [t('PropertiesDetails.price'), `₹ ${propertyDetailsData?.price}`],
                [t('PropertiesDetails.booking_amount'), '₹ 80,000'],
                [t('PropertiesDetails.address'), `${propertyDetailsData?.address_line || ''}`],
                [t('PropertiesDetails.gated_security'), 'Yes'],
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
                  backgroundColor: '#C53030',
                }}
                transition={{ duration: 0.3 }}
              >
                <Button
                  type="button"
                  onClick={() => setReportModalOpen(true)}
                  className="w-full bg-[#A21B1B] text-white px-4 py-2 rounded-lg shadow-md transition font-medium"
                >
                  <Flag size={18} className="inline mr-2" />
                  {t('PropertiesDetails.report_property') || 'Report'}
                </Button>
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
        </motion.aside>
        <ReportPropertyModal
          reportModalOpen={reportModalOpen}
          setReportModalOpen={setReportModalOpen}
          propertyId={propertyId ? String(propertyId) : ''}
        />
      </div>
    </motion.main>
  )
}

export default page
