'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

const Service = () => {
  const properties = [
    { id: 1, title: '3BHK', owner: 'Shankar', image: '/property1.png' },
    { id: 2, title: '3BHK', owner: 'Shankar', image: '/property2.png' },
    { id: 3, title: '3BHK', owner: 'Shankar', image: '/property3.png' },
    { id: 4, title: '3BHK', owner: 'Shankar', image: '/property1.png' },
    { id: 5, title: '3BHK', owner: 'Shankar', image: '/property3.png' },
    { id: 6, title: '3BHK', owner: 'Shankar', image: '/property2.png' },
  ]

  // Framer Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.15,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <main className="w-full  overflow-hidden">
      {/* Hero Section */}
      <section className="relative w-full h-[400px] flex items-center justify-center">
        <Image
          src="/property1.png"
          alt="Our Services"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Hero Text Animation */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative text-4xl sm:text-5xl md:text-6xl font-bold text-white z-10 text-center px-4"
        >
          Our Services
        </motion.h1>
      </section>

      {/* Search Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto py-12 px-6 flex flex-col md:flex-row gap-6 justify-center"
      >
        {['Search Properties', 'Search Location'].map((text, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full md:w-auto border-2 border-gray-800 px-8 py-3 rounded-md text-lg font-medium hover:bg-gray-100 transition-all duration-300"
          >
            {text}
          </motion.button>
        ))}
      </motion.section>

      {/* Properties Grid */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-6xl mx-auto px-6 py-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {properties.map(property => (
          <motion.div
            key={property.id}
            variants={cardVariants}
            whileHover={{ scale: 1.03 }}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
          >
            {/* Image */}
            <div className="relative w-full h-52 overflow-hidden">
              <Image
                src={property.image}
                alt={property.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />

              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="black"
                    viewBox="0 0 24 24"
                    stroke="black"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M5.25 5.653v12.693c0 .593.662.95 1.155.632l10.518-6.347a.75.75 0 000-1.264L6.405 5.021a.75.75 0 00-1.155.632z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="p-4">
              <h3 className="text-lg font-bold mb-1">{property.title}</h3>
              <p className="text-gray-600 text-sm">Owner: {property.owner}</p>
            </div>
          </motion.div>
        ))}
      </motion.section>
    </main>
  )
}

export default Service
