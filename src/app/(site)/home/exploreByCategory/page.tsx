'use client'

import ExploreProperties from '@/components/LandingPage/ExploreProperties/ExploreProperties'
import PopularProperties from '@/components/LandingPage/PopularProperties/PopularProperties'
import PropertySlider from '@/components/LandingPage/PropertySlider/PropertySlider'

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
