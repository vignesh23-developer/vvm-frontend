'use client'

import ExploreProperties from '@/components/ExploreProperties/ExploreProperties'
import PopularProperties from '@/components/PopularProperties/PopularProperties'
import PropertySlider from '@/components/PropertySlider/PropertySlider'
import React from 'react'

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
