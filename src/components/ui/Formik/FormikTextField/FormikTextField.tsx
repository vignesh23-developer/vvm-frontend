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
  maxLength?: number
  rows?: number
  isrequired?: boolean
  children?: React.ReactNode
}

export default function FormikTextField({
  label,
  name,
  type = 'text',
  as,
  placeholder,
  maxLength,
  rows,
  disabled = false,
  isrequired = false,
  children,
  className = 'w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none',
}: TextFieldProps) {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium mb-1">
        {label} {isrequired && <span className="text-red-500">*</span>}
      </label>
      <span>{children}</span>
      <Field
        id={name}
        name={name}
        type={type}
        as={as}
        placeholder={placeholder}
        className={className}
        maxLength={maxLength}
        rows={rows}
        disabled={disabled}
      />
      <ErrorMessage name={name} component="p" className="text-red-500 text-sm mt-1" />
    </div>
  )
}
