'use client'

import AgencyDetails from '@/components/buyer/Agency/AgencyDetails/AgencyDetails'
import { useParams } from 'next/navigation'

const page = () => {
  const params = useParams() as { name?: string | string[] }

  const rawName = Array.isArray(params.name) ? params.name[0] : params.name

  const decodedName = rawName ? decodeURIComponent(rawName) : ''

  return (
    <div>
      <AgencyDetails decodedName={decodedName} />
    </div>
  )
}

export default page
