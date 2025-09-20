'use client'
import HeroSection from '@/components/HeroSection/HeroSection'
import PopularProperties from '@/components/PopularProperties/PopularProperties'
import Testimonials from '@/components/Testimonials/Testimonials'
import AppPromo from '@/components/AppPromo/AppPromo'
import PropertyVideos from '@/components/PropertyVideos/PropertyVideos'
import ExploreProperties from '@/components/ExploreProperties/ExploreProperties'
import PropertySlider from '@/components/PropertySlider/PropertySlider'

const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <PropertySlider />
      <PopularProperties />
      <ExploreProperties />
      <Testimonials />
      <PropertyVideos />
      <AppPromo />
    </div>
  )
}

export default HomePage
