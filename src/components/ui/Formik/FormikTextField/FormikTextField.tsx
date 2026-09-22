'use client'

import { Field, ErrorMessage } from 'formik'

interface TextFieldProps {
  label: string
  name: string
  type?: string
  ref?: React.Ref<any>
  as?: string
  title?: string
  value?: any
  placeholder?: string
  readOnly?: boolean
  className?: string
  disabled?: boolean
  maxLength?: number
  rows?: number
  isrequired?: boolean
  children?: React.ReactNode
  onChange?: (e: React.ChangeEvent<any>) => void
}

export default function FormikTextField({
  label,
  name,
  type = 'text',
  ref,
  as,
  placeholder,
  maxLength,
  title,
  rows,
  value,
  readOnly = false,
  disabled = false,
  isrequired = false,
  children,
  onChange,
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
        title={title}
        placeholder={placeholder}
        className={className}
        maxLength={maxLength}
        rows={rows}
        readOnly={readOnly}
        disabled={disabled}
      />
      <ErrorMessage name={name} component="p" className="text-red-500 text-sm mt-1" />
    </div>
  )
}
