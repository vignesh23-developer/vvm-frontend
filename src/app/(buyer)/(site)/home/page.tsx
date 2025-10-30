'use client'
import HeroSection from '@/components/buyer/LandingPage/HeroSection/HeroSection'
import PopularProperties from '@/components/buyer/LandingPage/PopularProperties/PopularProperties'
import Testimonials from '@/components/buyer/LandingPage/Testimonials/Testimonials'
import AppPromo from '@/components/buyer/LandingPage/AppPromo/AppPromo'
import PropertyVideos from '@/components/buyer/LandingPage/PropertyVideos/PropertyVideos'
import ExploreProperties from '@/components/buyer/LandingPage/ExploreProperties/ExploreProperties'
import PropertySlider from '@/components/buyer/LandingPage/PropertySlider/PropertySlider'

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
