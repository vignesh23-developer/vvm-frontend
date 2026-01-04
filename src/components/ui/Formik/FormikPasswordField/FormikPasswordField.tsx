'use client'

import { Field, ErrorMessage } from 'formik'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

interface PasswordFieldProps {
  label: string
  name: string
  placeholder?: string
  className?: string
  disabled?: boolean
  isrequired?: boolean
}

export default function FormikPasswordField({
  label,
  name,
  placeholder,
  className = 'w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none',
  disabled = false,
  isrequired = false,
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(true)

  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium mb-1">
        {label} {isrequired && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <Field id={name} name={name} type={!showPassword ? 'text' : 'password'} placeholder={placeholder} className={className} disabled={disabled} />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
          tabIndex={-1}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      <ErrorMessage name={name} component="p" className="text-red-500 text-sm mt-1" />
    </div>
  )
}
