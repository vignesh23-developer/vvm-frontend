'use client'

import { Field, ErrorMessage } from 'formik'

interface TextFieldProps {
  label: string
  name: string
  type?: string
  as?: string
  placeholder?: string
  className?: string
  disabled?: boolean
  isrequired?: boolean
}

export default function FormikTextField({
  label,
  name,
  type = 'text',
  as,
  placeholder,
  disabled = false,
  isrequired = false,
  className = 'w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none',
}: TextFieldProps) {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium mb-1">
        {label} {isrequired && <span className="text-red-500">*</span>}
      </label>
      <Field id={name} name={name} type={type} as={as} placeholder={placeholder} className={className} disabled={disabled} />
      <ErrorMessage name={name} component="p" className="text-red-500 text-sm mt-1" />
    </div>
  )
}
