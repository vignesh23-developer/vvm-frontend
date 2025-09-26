'use client'
import HeroSection from '@/components/LandingPage/HeroSection/HeroSection'
import PopularProperties from '@/components/LandingPage/PopularProperties/PopularProperties'
import Testimonials from '@/components/LandingPage/Testimonials/Testimonials'
import AppPromo from '@/components/LandingPage/AppPromo/AppPromo'
import PropertyVideos from '@/components/LandingPage/PropertyVideos/PropertyVideos'
import ExploreProperties from '@/components/LandingPage/ExploreProperties/ExploreProperties'
import PropertySlider from '@/components/LandingPage/PropertySlider/PropertySlider'

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
