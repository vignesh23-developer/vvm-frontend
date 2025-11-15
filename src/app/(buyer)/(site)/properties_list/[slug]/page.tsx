import PropertiesListing from '@/components/buyer/PropertiesListing/PropertiesListing'
import React from 'react'

interface PropertiesListingProps {
  params: Promise<{ slug: string }>
}
const page = async ({ params }: PropertiesListingProps) => {
  const { slug } = await params

  return (
    <div>
      <PropertiesListing params={slug} />
    </div>
  )
}

export default page
