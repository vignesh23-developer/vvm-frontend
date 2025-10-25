'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import Button from '@/components/ui/CustomComponent/Button/Button'

export default function AppPromo() {
  const t = useTranslations()

  return (
    <section className="w-full bg-gradient-to-r from-[#ECF1F8] to-[#D9D9D9] py-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
        {/* Left content */}
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-3xl lg:text-5xl font-extrabold text-gray-900 leading-tight"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {t('AppPromo.title')}
          </motion.h2>

          <motion.p
            className="text-gray-600 max-w-xl"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            viewport={{ once: true }}
          >
            {t('AppPromo.description')}
          </motion.p>

          {/* Store buttons */}
          <motion.div
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <Image
                src="/googleplay.png"
                alt="Get it on Google Play"
                width={160}
                height={48}
                className="cursor-pointer drop-shadow-sm"
              />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <Image
                src="/appstore.png"
                alt="Download on the App Store"
                width={160}
                height={48}
                className="cursor-pointer drop-shadow-sm"
              />
            </motion.div>
          </motion.div>

          {/* Subscription */}
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
          >
            <p className="text-gray-700 font-medium">{t('AppPromo.message')}</p>
            <form className="flex max-w-md rounded-md overflow-hidden border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500">
              <input
                type="email"
                placeholder={t('AppPromo.placeholder')}
                className="w-full px-4 py-3 text-gray-700 focus:outline-none"
              />
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  type="submit"
                  variant="primary"
                  size="medium"
                  className="px-6 py-3 bg-gray-900 text-white"
                  hover="hover:bg-gray-800 transition"
                  onClick={() => {}}
                >
                  {t('AppPromo.subscribe')}
                </Button>
              </motion.div>
            </form>
          </motion.div>
        </motion.div>

        {/* Right content - Phone mockups */}
        {/* <motion.div
          className="flex justify-center relative"
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          viewport={{ once: true }}
        > */}
        {/* Example animated mockups */}
        {/* <motion.div
            className="absolute top-6 left-12 w-44 h-96 transform -rotate-6 shadow-xl hidden lg:block"
            initial={{ rotate: -10, opacity: 0, y: 50 }}
            whileInView={{ rotate: -6, opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Image
              src="/Frame-545.png"
              alt="Phone mockup back"
              fill
              className="object-contain"
            />
          </motion.div> */}

        {/* <motion.div
            className="relative w-52 h-[28rem] shadow-2xl"
            initial={{ scale: 0.8, opacity: 0, y: 60 }}
            whileInView={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <Image
              src="/Frame-546.png"
              alt="Phone mockup front"
              fill
              className="object-contain"
            />
          </motion.div> */}
        {/* </motion.div> */}
      </div>
    </section>
  )
}
