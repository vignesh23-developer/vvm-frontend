'use client'

import { Field, ErrorMessage } from 'formik'

interface FormikSelectProps {
  name: string
  label: string
  options: { value: string; label: string }[]
  className?: string
}

export default function FormikSelectField({
  name,
  label,
  options,
  className = 'w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none',
}: FormikSelectProps) {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium mb-1">
        {label}
      </label>

      <Field as="select" id={name} name={name} className={className}>
        <option value="">Select {label}</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </Field>

      <ErrorMessage
        name={name}
        component="p"
        className="text-red-500 text-sm mt-1"
      />
    </div>
  )
}
