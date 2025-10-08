'use client'

import { Field, ErrorMessage } from 'formik'

interface TextFieldProps {
  label: string
  name: string
  type?: string
  as?: string
  placeholder?: string
  className?: string
}

export default function FormikTextField({
  label,
  name,
  type = 'text',
  as,
  placeholder,
  className = 'w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none',
}: TextFieldProps) {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium mb-1">
        {label}
      </label>
      <Field
        id={name}
        name={name}
        type={type}
        as={as}
        placeholder={placeholder}
        className={className}
      />
      <ErrorMessage
        name={name}
        component="p"
        className="text-red-500 text-sm mt-1"
      />
    </div>
  )
}
