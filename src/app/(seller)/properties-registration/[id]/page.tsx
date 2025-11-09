'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import PropertiesRegistrationPage from '@/app/(seller)/properties-registration/page'

const EditPropertiesRegistration = () => {
  const params = useParams()
  const { id } = params
  console.log('Editing property registration with ID:', id)

  return (
    <div>
      <PropertiesRegistrationPage propertiesId={id as string} />
    </div>
  )
}

export default EditPropertiesRegistration
