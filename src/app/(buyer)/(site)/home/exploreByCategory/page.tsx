'use client'

import ExploreProperties from '@/components/buyer/LandingPage/ExploreProperties/ExploreProperties'
import PopularProperties from '@/components/buyer/LandingPage/PopularProperties/PopularProperties'
import PropertySlider from '@/components/buyer/LandingPage/PropertySlider/PropertySlider'

function page() {
  return (
    <div>
      <PropertySlider />
      <PopularProperties />
      <ExploreProperties />
      <PopularProperties />
    </div>
  )
}

export default page
