'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { useFormikContext } from 'formik'
import FormikTextField from '@/components/ui/Formik/FormikTextField/FormikTextField'
import { postMethod } from '@/services/service'
import { appEndpoints } from '@/services/endpoints'
import { ResponseDTO } from '@/components/dto/response_dto'

// Debounce hook
function useDebounce<T>(value: T, delay = 600): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timeout)
  }, [value, delay])
  return debounced
}

// Status messages
const STATUS_MESSAGES: Record<string, ReactNode> = {
  idle: null,
  verifying: <span className="text-gray-500">Checking availability...</span>,
  available: <span className="text-green-600">This profile name is available</span>,
  taken: <span className="text-red-600">This profile name is already taken</span>,
  error: <span className="text-yellow-600">Something went wrong. Please try again.</span>,
}

type Status = keyof typeof STATUS_MESSAGES

export default function ProfileNameField() {
  const { values, errors, touched, validateField } = useFormikContext<{ profileName: string }>()
  const [status, setStatus] = useState<Status>('idle')
  const debouncedName = useDebounce(values.profileName?.trim() || '', 600)

  useEffect(() => {
    const shouldVerify = debouncedName && touched.profileName && !errors.profileName
    if (!shouldVerify) return setStatus('idle')

    const verify = async () => {
      setStatus('verifying')
      try {
        const res = (await postMethod(appEndpoints.validateProfileName, { profileName: debouncedName })) as ResponseDTO
        setStatus(res?.data?.isAvailable ? 'available' : 'taken')
      } catch {
        setStatus('error')
      }
    }

    validateField('profileName').then(() => verify())
  }, [debouncedName, touched.profileName, errors.profileName, validateField])

  return (
    <div className="space-y-1">
      <FormikTextField label="Profile Name" name="profileName" placeholder="Enter profile name" />
      <div className="text-sm font-medium h-5">{STATUS_MESSAGES[status]}</div>
    </div>
  )
}
