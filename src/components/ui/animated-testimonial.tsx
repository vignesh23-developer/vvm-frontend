'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { Star } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

type Testimonial = {
  quote: string
  name: string
  designation: string
  src?: string
  rating?: number
  id?: number | string
}
export const AnimatedTestimonials = ({ testimonials, autoplay = false }: { testimonials: Testimonial[]; autoplay?: boolean }) => {
  const [active, setActive] = useState(0)

  const handleNext = () => {
    setActive(prev => (prev + 1) % testimonials.length)
  }

  const handlePrev = () => {
    setActive(prev => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const isActive = (index: number) => {
    return index === active
  }

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(() => {
        setActive(prev => (prev + 1) % testimonials.length)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [autoplay, testimonials.length])

  const randomRotateY = () => {
    return Math.floor(Math.random() * 21) - 10
  }
  // Generate avatar from name if no image provided
  const getAvatarContent = (name: string) => {
    return name.charAt(0).toUpperCase()
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-10 font-sans antialiased md:max-w-5xl md:px-8 lg:px-12">
      <div className="relative grid grid-cols-1 gap-12 md:gap-16 lg:gap-20 md:grid-cols-2 items-center">
        {/* Image Stack Section */}
        <div className="order-2 md:order-1">
          <div className="relative h-96 w-full md:h-[500px]">
<<<<<<< HEAD
            <div className="relative w-full h-full">
=======
            <AnimatePresence>
>>>>>>> c6cbc4e3d9f2fcc41d5f42588f6110f22844d23d
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id || testimonial.name || index}
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                    z: -100,
                    rotate: randomRotateY(),
                  }}
                  animate={{
                    opacity: isActive(index) ? 1 : 0.6,
                    scale: isActive(index) ? 1 : 0.92,
                    z: isActive(index) ? 0 : -100,
                    rotate: isActive(index) ? 0 : randomRotateY(),
                    zIndex: isActive(index) ? 40 : testimonials.length + 2 - index,
                    y: isActive(index) ? [0, -20, 0] : 0,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: 'easeInOut',
                  }}
                  className="absolute inset-0 origin-bottom"
                >
                  {testimonial.src ? (
                    <Image
                      src={testimonial.src}
                      alt={testimonial.name}
                      fill
                      draggable={false}
                      className="h-full w-full rounded-3xl object-cover object-center shadow-2xl border-4 border-white"
                    />
                  ) : (
<<<<<<< HEAD
                    <div className="h-full w-full rounded-3xl bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 flex items-center justify-center shadow-2xl border-4 border-white relative overflow-hidden">
                      <div className="absolute inset-0 backdrop-blur-3xl bg-white/30" />
                      <div className="relative z-10 flex flex-col items-center justify-center opacity-60">
                        <div className="w-32 h-32 rounded-full bg-gray-300/50 mb-4 flex items-center justify-center backdrop-blur-md border border-white/50">
                          <span className="text-5xl font-bold text-gray-500">{getAvatarContent(testimonial.name)}</span>
                        </div>
                      </div>
=======
                    <div className="h-full w-full rounded-3xl bg-gradient-to-br from-yellow-100 via-yellow-50 to-white flex items-center justify-center shadow-2xl border-4 border-white">
                      <span className="text-8xl font-black text-[#3b1804]">{getAvatarContent(testimonial.name)}</span>
>>>>>>> c6cbc4e3d9f2fcc41d5f42588f6110f22844d23d
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="order-1 md:order-2 flex flex-col justify-between py-4 min-h-[400px]">
          <motion.div
            key={active}
            initial={{
              y: 20,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: -20,
              opacity: 0,
            }}
            transition={{
              duration: 0.3,
              ease: 'easeInOut',
            }}
            className="flex-1"
          >
            {/* Quote Icon */}
            <div className="mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg">
                <span className="text-4xl font-serif text-white">"</span>
              </div>
            </div>

            {/* Name and Designation */}
            <div className="mb-6">
<<<<<<< HEAD
              <h3 className="text-3xl md:text-4xl font-black text-[#2a1407] mb-2 ">
                {testimonials[active].name}
              </h3>
              <p className="text-base md:text-lg font-semibold text-yellow-600">
                {testimonials[active].designation}
              </p>
=======
              <h3 className="text-3xl md:text-4xl font-black text-[#3b1804] mb-2 ">{testimonials[active].name}</h3>
              <p className="text-base md:text-lg font-semibold text-yellow-600">{testimonials[active].designation}</p>
>>>>>>> c6cbc4e3d9f2fcc41d5f42588f6110f22844d23d
            </div>

            {/* Rating Stars */}
            {testimonials[active].rating && (
              <div className="flex gap-1 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
<<<<<<< HEAD
                    className={`w-5 h-5 transition-all duration-300 ${i < (testimonials[active].rating || 0)
                      ? 'fill-yellow-500 text-yellow-500 scale-110'
                      : 'text-gray-300'
                      }`}
=======
                    className={`w-5 h-5 transition-all duration-300 ${
                      i < (testimonials[active].rating || 0) ? 'fill-yellow-500 text-yellow-500 scale-110' : 'text-gray-300'
                    }`}
>>>>>>> c6cbc4e3d9f2fcc41d5f42588f6110f22844d23d
                  />
                ))}
              </div>
            )}

            {/* Quote Text with Word Animation */}
            <motion.p className="text-lg md:text-xl text-gray-700 leading-relaxed font-medium">
              {testimonials[active].quote.split(' ').map((word, index) => (
                <motion.span
                  key={index}
                  initial={{
                    filter: 'blur(10px)',
                    opacity: 0,
                    y: 5,
                  }}
                  animate={{
                    filter: 'blur(0px)',
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.15,
                    ease: 'easeOut',
                    delay: 0.015 * index,
                  }}
                  className="inline-block"
                >
                  {word}&nbsp;
                </motion.span>
              ))}
            </motion.p>
          </motion.div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-4 pt-8 mt-8 border-t border-gray-200">
            {/* Pagination Dots */}
            <div className="flex gap-2 flex-1">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActive(index)}
<<<<<<< HEAD
                  className={`h-2 rounded-full transition-all duration-300 ${isActive(index)
                    ? 'w-8 bg-gradient-to-r from-yellow-500 to-yellow-600'
                    : 'w-2 bg-gray-300 hover:bg-yellow-400'
                    }`}
=======
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isActive(index) ? 'w-8 bg-gradient-to-r from-yellow-500 to-yellow-600' : 'w-2 bg-gray-300 hover:bg-yellow-400'
                  }`}
>>>>>>> c6cbc4e3d9f2fcc41d5f42588f6110f22844d23d
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            {/* Arrow Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handlePrev}
                className="group/button flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-200 shadow-lg hover:shadow-xl hover:from-yellow-100 hover:to-yellow-200 transition-all duration-300 hover:scale-110"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-6 w-6 text-yellow-700 transition-transform duration-300 group-hover/button:-translate-x-1" />
              </button>
              <button
                onClick={handleNext}
                className="group/button flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 shadow-lg hover:shadow-xl hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 hover:scale-110"
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-6 w-6 text-white transition-transform duration-300 group-hover/button:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
