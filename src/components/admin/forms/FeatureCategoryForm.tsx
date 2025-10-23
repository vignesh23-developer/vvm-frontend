'use client'

import { Formik, Form } from 'formik'
import FormikTextField from '@/components/ui/Formik/FormikTextField/FormikTextField'
import { useRouter } from 'next/navigation'
import FormikCheckboxField from '@/components/ui/Formik/FormikCheckboxField/FormikCheckboxField'
import FormikSelectField from '@/components/ui/Formik/FormikSelectField/FormikSelectField'

interface FeatureFormValues {
  code: string
  name: string
  description: string
  input_type?: string
  filterable?: boolean
  mandatory?: boolean
  sort_order?: number
  is_active?: boolean
}

interface PropertyCategoryFormProps {
  /** Form initial values */
  initialValues: FeatureFormValues

  /** Yup validation schema */
  validationSchema: any

  /** Submit handler */
  onSubmit: (values: FeatureFormValues) => Promise<void>

  /** Optional — Change button label dynamically */
  submitLabel?: string

  /** Optional — Change button state for add/edit */
  isEdit?: boolean
}

export default function PropertyCategoryForm({
  initialValues,
  validationSchema,
  onSubmit,
  submitLabel,
  isEdit = false,
}: PropertyCategoryFormProps) {
  const router = useRouter()

  const options = [
    { value: '', label: 'Select input type' },
    { value: 'single select', label: 'Single Select' },
    { value: 'multiple select', label: 'Multiple Select' },
    { value: 'numeric', label: 'Numeric' },
    { value: 'text', label: 'Text' },
  ]

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      enableReinitialize
      onSubmit={onSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-6">
          {/* Code */}
          <div>
            <FormikTextField
              label="Code *"
              type="text"
              name="code"
              placeholder="e.g., APT, VILLA, FLAT, etc."
              className="w-full border-0 bg-gray-100 rounded-md px-4 py-3 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-black focus:bg-white transition"
            />
          </div>
          {/* Feature Category Name */}
          <div>
            <FormikTextField
              label="Feature Category Name *"
              type="text"
              name="name"
              placeholder="Enter feature Category Name"
              className="w-full border-0 bg-gray-100 rounded-md px-4 py-3 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-black focus:bg-white transition"
            />
          </div>

          {/* Description */}
          <div>
            <FormikTextField
              label="Description"
              as="textarea"
              name="description"
              placeholder="Enter Description"
              className="w-full border-0 bg-gray-100 rounded-md px-4 py-3 h-36 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-black focus:bg-white transition"
            />
          </div>
          {/* Icon */}
          <div>
            <FormikSelectField
              label="Input Type"
              name="input_type"
              options={options}
              className="w-full border-0 bg-gray-100 rounded-md px-4 py-3 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-black focus:bg-white transition"
            />
          </div>
          {/* Sort Order */}
          <div>
            <FormikTextField
              label="Sort Order"
              type="number"
              name="sort_order"
              placeholder="Enter sort order"
              min={10}
              step={10} // 👈 increments by 10
              className="w-full border-0 bg-gray-100 rounded-md px-4 py-3 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-black focus:bg-white transition"
            />
          </div>

          <div>
            <FormikCheckboxField label="Filterable" name="filterable" />
          </div>
          <div>
            <FormikCheckboxField label="Mandatory" name="mandatory" />
          </div>
          <div>
            <FormikCheckboxField label="Is Active" name="is_active" />
          </div>

          {/* Buttons */}
          <div className="flex justify-end items-center gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2 rounded-md text-white font-medium transition ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-black hover:bg-gray-800'
              }`}
            >
              {isSubmitting
                ? isEdit
                  ? 'Updating...'
                  : 'Creating...'
                : submitLabel ||
                  (isEdit
                    ? 'Update Property Category'
                    : 'Create Property Category')}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  )
}
