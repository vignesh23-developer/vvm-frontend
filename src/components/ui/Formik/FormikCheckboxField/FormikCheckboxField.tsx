'use client'

import { Field, ErrorMessage } from 'formik'

interface CheckboxFieldProps {
  label: string
  name: string
  className?: string
}

export default function FormikCheckboxField({
  label,
  name,
  className = 'h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500',
}: CheckboxFieldProps) {
  return (
    <div className="mb-4 flex items-center">
      <Field id={name} name={name} type="checkbox" className={className} />
      <label
        htmlFor={name}
        className="ml-2 block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <ErrorMessage
        name={name}
        component="p"
        className="text-red-500 text-sm mt-1 ml-6"
      />
    </div>
  )
}
