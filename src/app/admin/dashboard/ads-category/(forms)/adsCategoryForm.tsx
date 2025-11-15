'use client'

import { Formik, Form, Field } from 'formik'
import FormikTextField from '@/components/ui/Formik/FormikTextField/FormikTextField'
import { useRouter } from 'next/navigation'
import FormikCheckboxField from '@/components/ui/Formik/FormikCheckboxField/FormikCheckboxField'

import { FormikIconPickerField } from '@/components/ui/Formik/FormikIconPickerField'
import adsCategorySchema from '@/utils/validations/admin/adsCategory/adsCategoryValidation'

export interface FormValues {
  name: string
  icon: string
  description: string
  sortOrder?: number
  isActive?: boolean
}

interface AdsCategoryFormProps {
  initialValues: FormValues
  /** Submit handler */
  onSubmit: (values: FormValues) => Promise<void>

  /** Optional — Change button label dynamically */
  submitLabel?: string

  /** Optional — Change button state for add/edit */
  isEdit?: boolean
}

export default function AdsCategoryForm({ initialValues, onSubmit, submitLabel, isEdit = false }: AdsCategoryFormProps) {
  const router = useRouter()

  return (
    <Formik initialValues={initialValues} validationSchema={adsCategorySchema} enableReinitialize onSubmit={onSubmit}>
      {({ isSubmitting, errors, touched }) => (
        <Form className="space-y-6">
          {/* Ads Category Name */}
          <div>
            <FormikTextField
              label="Ads Category Name *"
              type="text"
              name="name"
              placeholder="Enter Ads Category Name"
              className="w-full border-0 bg-gray-100 rounded-md px-4 py-3 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-black focus:bg-white transition"
            />
          </div>
          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <Field
              as="textarea"
              name="description"
              id="description"
              placeholder="Enter Description"
              className="w-full border-0 bg-gray-100 rounded-md px-4 py-3 h-36 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-black focus:bg-white transition resize-none"
            />
            {errors.description && touched.description && <div className="text-red-600 text-sm mt-1">{errors.description}</div>}
          </div>
          {/* Sort Order */}
          <div>
            <FormikTextField
              label="Sort Order"
              type="number"
              name="sortOrder"
              placeholder="Enter sort order"
              className="w-full border-0 bg-gray-100 rounded-md px-4 py-3 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-black focus:bg-white transition"
            />
          </div>
          {/* Is Active */}
          {!isEdit && (
            <div>
              <FormikCheckboxField label="Is Active" name="isActive" />
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end items-center gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.push('/admin/dashboard/ads-category')}
              className="px-6 py-2 rounded-md bg-gray-200 hover:bg-gray-300 cursor-pointer text-gray-800 font-medium transition"
              title="cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2 rounded-md text-white font-medium transition ${
                isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800 cursor-pointer'
              }`}
              title="submit"
            >
              {isSubmitting ? (isEdit ? 'Updating...' : 'Creating...') : submitLabel || (isEdit ? 'Update Ads Category' : 'Create Ads Category')}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  )
}
