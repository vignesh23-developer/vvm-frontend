'use client'
import { useParams } from 'next/navigation'
import PropertiesRegistrationPage from '@/app/(seller)/properties-registration/page'

const EditPropertiesRegistration = () => {
  const params = useParams()
  const { id } = params

  return (
    <div>
      <PropertiesRegistrationPage propertiesId={id as string} />
    </div>
  )
}

export default EditPropertiesRegistration
