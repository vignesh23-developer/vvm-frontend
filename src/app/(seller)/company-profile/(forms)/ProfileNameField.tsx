'use client'

import { useEffect, useState } from 'react'
import { useFormikContext } from 'formik'
import FormikTextField from '@/components/ui/Formik/FormikTextField/FormikTextField'
import { postMethod } from '@/services/service'
import { appEndpoints } from '@/services/endpoints'
import { ResponseDTO } from '@/components/dto/response_dto'

// Simple debounce hook
const useDebounce = <T,>(value: T, delay = 600): T => {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debounced
}

export default function ProfileNameField() {
  const { values, errors, touched, validateField } = useFormikContext<{ profileName: string }>()
  const [status, setStatus] = useState<'idle' | 'verifying' | 'available' | 'taken' | 'error'>('idle')

  const debouncedName = useDebounce(values.profileName?.trim(), 600)

  useEffect(() => {
    const verify = async () => {
      if (!debouncedName || !touched.profileName) return setStatus('idle')

      await validateField('profileName')
      if (errors.profileName) return setStatus('idle')

      setStatus('verifying')
      try {
        const res = (await postMethod(appEndpoints.validateProfileName, {
          profileName: debouncedName,
        })) as ResponseDTO

        setStatus(res?.data?.isAvailable ? 'available' : 'taken')
      } catch {
        setStatus('error')
      }
    }

    verify()
  }, [debouncedName])

  const statusText = {
    idle: null,
    verifying: <span className="text-gray-500">Checking availability...</span>,
    available: <span className="text-green-600">This profile name is available</span>,
    taken: <span className="text-red-600">This profile name is already taken</span>,
    error: <span className="text-yellow-600">Something went wrong. Please try again.</span>,
  }[status]

  return (
    <div className="space-y-3">
      <FormikTextField label="Profile Name" name="profileName" placeholder="Enter profile name" />
      <div className="text-sm font-medium h-5">{statusText}</div>
    </div>
  )
}
