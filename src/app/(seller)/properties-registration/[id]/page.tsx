'use client'
import { useParams } from 'next/navigation'
import PropertiesRegistrationPage from '@/app/(seller)/properties-registration/page'

export default function EditPropertiesRegistration() {
  const params = useParams()
  const { id } = params

  return <PropertiesRegistrationPage searchParams={Promise.resolve({ propertiesId: id as string })} mode="edit" />
}
