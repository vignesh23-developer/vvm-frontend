'use client'

import AgencyDetails from '@/components/buyer/Agency/AgencyDetails/AgencyDetails'
import { useParams } from 'next/navigation'

const page = () => {
  const params = useParams() as string | any

  const name = Array.isArray(params.name) ? params.name[0] : params.name
  console.log('Params in Agency Details Page:', name)
  return (
    <div>
      <AgencyDetails name={name} />
    </div>
  )
}

export default page
