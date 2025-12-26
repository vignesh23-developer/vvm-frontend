'use client'

import { motion, Variants } from 'framer-motion'
import { useSearchParams, useRouter } from 'next/navigation'
import { useLandingPageData } from '@/app/(buyer)/(site)/(hooks)/useLandingPageDataHook'
import HeroSection from '@/components/buyer/LandingPage/HeroSection/HeroSection'
import PopularProperties from '@/components/buyer/LandingPage/PopularProperties/PopularProperties'
import Testimonials from '@/components/buyer/LandingPage/Testimonials/Testimonials'
import AppPromo from '@/components/buyer/LandingPage/AppPromo/AppPromo'
import PropertyVideos from '@/components/buyer/LandingPage/PropertyVideos/PropertyVideos'
import ExploreProperties from '@/components/buyer/LandingPage/ExploreProperties/ExploreProperties'
import AdsSlider from '@/components/buyer/LandingPage/AdsSlider/AdsSlider'
import { WebsiteReview } from '@/components/Reviews'
import WhyChooseUs from '@/components/buyer/LandingPage/WhyChooseUs/WhyChooseUs'
import Button from '@/components/ui/CustomComponent/Button/Button'

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

export default function SitePage() {
  const searchParams = useSearchParams()
  const district = searchParams?.get('district')
  const router = useRouter()
  const {
    data,
    featuredAds,
    featuredAdsTotal,
    propertiesData,
    propertiesTotal,
    propertyCategories,
    testimonialsData,
    districtSummaryData,
    error,
    isLoading,
    mutate,
  } = useLandingPageData({
    ads_limit: 6,
    properties_limit: 12,
    reviews_limit: 5,
    districts_limit: 4,
    enabled: true,
  })

  console.log('Landing Page Data:', data)

  return (
    <main className="flex flex-col gap-0">
      <motion.div variants={sectionVariants} initial="hidden" animate="visible">
        <HeroSection propertyCategories={propertyCategories} error={error} isLoading={isLoading} mutate={mutate} />
      </motion.div>

      <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
        <AdsSlider featuredAds={featuredAds} featuredAdsTotal={featuredAdsTotal} error={error} isLoading={isLoading} mutate={mutate} />
      </motion.div>

      <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
        <PopularProperties
          district={district || undefined}
          packageType={district ? 'PLATINUM' : undefined}
          propertiesData={propertiesData}
          propertiesTotal={propertiesTotal}
          error={error}
          isLoading={isLoading}
          mutate={mutate}
        />
      </motion.div>

      <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
        <ExploreProperties districtSummaryData={districtSummaryData} error={error} isLoading={isLoading} mutate={mutate} />
      </motion.div>

      <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
        <Testimonials testimonialsData={testimonialsData} error={error} isLoading={isLoading} mutate={mutate} />
      </motion.div>

      <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
        <WhyChooseUs />
      </motion.div>

      {/* <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
        <PropertyVideos />
      </motion.div> */}

      <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
        <AppPromo />
      </motion.div>

      {/* Call to Action Section at Bottom */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="relative py-16 sm:py-20 overflow-hidden bg-gradient-to-br from-yellow-50 via-white to-yellow-100"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-100/25 via-yellow-50/12 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#2a1407] mb-4"
          >
            Ready to Find Your Ideal Property?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg sm:text-xl text-gray-600 mb-8"
          >
            Start your property journey today with Tamil Nadu's most trusted real estate platform
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Button
              type="button"
              onClick={() => router.push('/properties-list')}
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-[#2a1407] px-8 py-4 rounded-lg font-bold text-lg hover:from-yellow-500 hover:to-yellow-600 transition shadow-xl hover:shadow-2xl"
            >
              Start Searching →
            </Button>
          </motion.div>
        </div>
      </motion.section>
    </main>
  )
}
