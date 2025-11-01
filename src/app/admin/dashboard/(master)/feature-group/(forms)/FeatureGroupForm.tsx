'use client'

import { Formik, Form } from 'formik'
import FormikTextField from '@/components/ui/Formik/FormikTextField/FormikTextField'
import { useRouter } from 'next/navigation'
import FormikCheckboxField from '@/components/ui/Formik/FormikCheckboxField/FormikCheckboxField'
import featureGroupSchema from '@/utils/validations/admin/featureGroupValidation'
import type { FeatureGroupFormProps } from '@/app/admin/dashboard/(master)/feature-group/(dto)/FeatureGroupType'

export default function FeatureGroupForm({ initialValues, onSubmit, submitLabel, isEdit = false }: FeatureGroupFormProps) {
  const router = useRouter()

  return (
    <Formik initialValues={initialValues} validationSchema={featureGroupSchema} enableReinitialize onSubmit={onSubmit}>
      {({ isSubmitting }) => (
        <Form className="space-y-6">
          {/* Property Category Name */}
          <div>
            <FormikTextField
              label="Name *"
              type="text"
              name="name"
              placeholder="Enter Name"
              className="w-full border-0 bg-gray-100 rounded-md px-4 py-3 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-black focus:bg-white transition"
            />
          </div>

          {/* Description */}
          <div>
            <FormikTextField
              label="Icon"
              type="text"
              name="icon"
              placeholder="Enter icon"
              className="w-full border-0 bg-gray-100 rounded-md px-4 py-3 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-black focus:bg-white transition"
            />
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
              onClick={() => router.push('/admin/dashboard/feature-group')}
              className="px-6 py-2 rounded-md bg-gray-200 hover:bg-gray-300 cursor-pointer text-gray-800 font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2 rounded-md text-white font-medium transition ${
                isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800 cursor-pointer'
              }`}
            >
              {isSubmitting ? (isEdit ? 'Updating...' : 'Creating...') : submitLabel || (isEdit ? 'Update Feature Group' : 'Create Feature Group')}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  )
}
