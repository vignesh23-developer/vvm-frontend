import { useField } from 'formik'
import type {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react'

interface BaseFieldProps {
  label: string
  name: string
  required?: boolean
}

interface InputFieldProps
  extends BaseFieldProps,
    Omit<InputHTMLAttributes<HTMLInputElement>, 'name'> {
  type?: 'text' | 'email' | 'tel' | 'number'
}

interface SelectFieldProps
  extends BaseFieldProps,
    Omit<SelectHTMLAttributes<HTMLSelectElement>, 'name'> {
  options: Array<{ value: string; label: string }>
}

interface TextAreaFieldProps
  extends BaseFieldProps,
    Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'name'> {}

const baseFieldClasses =
  'w-full rounded-lg border p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
const errorFieldClasses = 'border-red-500 ring-1 ring-red-500'
const normalFieldClasses = 'border-gray-300'

export function InputField({
  label,
  required,
  type = 'text',
  className = '',
  ...props
}: InputFieldProps) {
  const [field, meta] = useField(props.name)
  const hasError = meta.touched && meta.error

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        {...field}
        {...props}
        type={type}
        className={`${baseFieldClasses} ${
          hasError ? errorFieldClasses : normalFieldClasses
        } ${className}`}
      />
      {hasError && <p className="mt-1 text-sm text-red-600">{meta.error}</p>}
    </div>
  )
}

export function SelectField({
  label,
  required,
  options,
  className = '',
  ...props
}: SelectFieldProps) {
  const [field, meta] = useField(props.name)
  const hasError = meta.touched && meta.error

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        {...field}
        {...props}
        className={`${baseFieldClasses} ${
          hasError ? errorFieldClasses : normalFieldClasses
        } ${className}`}
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {hasError && <p className="mt-1 text-sm text-red-600">{meta.error}</p>}
    </div>
  )
}

export function TextAreaField({
  label,
  required,
  className = '',
  ...props
}: TextAreaFieldProps) {
  const [field, meta] = useField(props.name)
  const hasError = meta.touched && meta.error

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        {...field}
        {...props}
        className={`${baseFieldClasses} ${
          hasError ? errorFieldClasses : normalFieldClasses
        } ${className}`}
      />
      {hasError && <p className="mt-1 text-sm text-red-600">{meta.error}</p>}
    </div>
  )
}
