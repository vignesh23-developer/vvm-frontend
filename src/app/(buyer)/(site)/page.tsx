'use client'

import { motion, Variants } from 'framer-motion'
import HeroSection from '@/components/buyer/LandingPage/HeroSection/HeroSection'
import PopularProperties from '@/components/buyer/LandingPage/PopularProperties/PopularProperties'
import Testimonials from '@/components/buyer/LandingPage/Testimonials/Testimonials'
import AppPromo from '@/components/buyer/LandingPage/AppPromo/AppPromo'
import PropertyVideos from '@/components/buyer/LandingPage/PropertyVideos/PropertyVideos'
import ExploreProperties from '@/components/buyer/LandingPage/ExploreProperties/ExploreProperties'
import PropertySlider from '@/components/buyer/LandingPage/PropertySlider/PropertySlider'

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

export default function SitePage() {
  return (
    <main className="flex flex-col gap-0">
      <motion.div variants={sectionVariants} initial="hidden" animate="visible">
        <HeroSection />
      </motion.div>

      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <PropertySlider />
      </motion.div>

      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <PopularProperties />
      </motion.div>

      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <ExploreProperties />
      </motion.div>

      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <Testimonials />
      </motion.div>

      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <PropertyVideos />
      </motion.div>

      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <AppPromo />
      </motion.div>
    </main>
  )
}
