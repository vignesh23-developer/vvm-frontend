'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { motion, Variants } from 'framer-motion'

const About = () => {
  const t = useTranslations()

  const aboutImage = [
    { src: '/about1.png', alt: 'Living room', width: 500, height: 500 },
    { src: '/about2.png', alt: 'Modern interior', width: 500, height: 500 },
    { src: '/about3.png', alt: 'Cozy home', width: 500, height: 500 },
    { src: '/about4.png', alt: 'Luxury home', width: 500, height: 500 },
  ]

  // Animation Variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  }

  return (
    <section className="w-full py-10 bg-white overflow-hidden">
      <motion.div
        className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-10 items-start"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {/* Left side - Image Grid */}
        <motion.div
          className="grid grid-cols-2 grid-rows-2 gap-4 relative"
          variants={itemVariants}
        >
          {aboutImage.map((value, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            >
              <Image
                src={value.src}
                alt={value.alt}
                width={value.width}
                height={value.height}
                className="w-full h-full object-cover"
              />
            </motion.div>
          ))}

          {/* White circle overlay with subtle pulsing effect */}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white rounded-full shadow-md"
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            animate={{
              boxShadow: [
                '0 0 10px rgba(0,0,0,0.1)',
                '0 0 20px rgba(0,0,0,0.2)',
                '0 0 10px rgba(0,0,0,0.1)',
              ],
            }}
          />
        </motion.div>

        {/* Right side - Content */}
        <motion.div
          variants={itemVariants}
          className="text-center lg:text-left"
        >
          <motion.h2
            variants={itemVariants}
            className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4"
          >
            {t('About.title')}
          </motion.h2>

          <motion.h3
            variants={itemVariants}
            className="text-lg sm:text-xl font-semibold text-gray-700 mb-6"
          >
            {t('About.header')}
          </motion.h3>

          <motion.p
            variants={itemVariants}
            className="text-gray-600 leading-relaxed text-justify mb-8"
          >
            {t('About.description')}
          </motion.p>

          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.05, backgroundColor: '#3A2A20' }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="bg-[#2B1B12] text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition font-medium"
          >
            {t('About.explore_more')}
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default About
