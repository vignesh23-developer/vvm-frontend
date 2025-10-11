'use client'

import { Field, ErrorMessage } from 'formik'

interface FormikRadioProps {
  name: string
  value: string
  label: string
  className?: string
}
export default function FormikRadioField({
  name,
  value,
  label,
  className = '',
}: FormikRadioProps) {
  return (
    <div className="flex flex-col">
      <label
        className={`flex items-center gap-2 cursor-pointer select-none ${className}`}
      >
        <Field
          type="radio"
          name={name}
          value={value}
          className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500"
        />
        <span className="text-gray-800">{label}</span>
      </label>

      <ErrorMessage
        name={name}
        component="p"
        className="text-sm text-red-500 mt-1"
      />
    </div>
  )
}
