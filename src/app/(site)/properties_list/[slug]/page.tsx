import PropertiesListing from '@/components/PropertiesListing/PropertiesListing'
import React from 'react'

type Props = { params: { slug: string } }
const page = ({ params }: Props) => {
  console.log(params, 'slug')
  return (
    <div>
      <PropertiesListing params={params.slug} />
    </div>
  )
}

export default page
