'use client'

import ModalComponent from '@/components/ui/CustomComponent/Modal/ModalComponent'
import { Formik, Form } from 'formik'
import Button from '@/components/ui/CustomComponent/Button/Button'

interface ProfileImageModalProps {
  isModalOpen: boolean
  setIsModalOpen: (open: boolean) => void
  buttonText?: string
  modalTitle?: string
  modalLabel?: string
  modalDescription?: string
  onImageUploadSubmit: (values: ProfileFormValues, helpers: any) => void
}

interface ProfileFormValues {
  file: File | null
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024 // 5MB
const ALLOWED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

const UploadProfileImageModal = ({
  isModalOpen,
  setIsModalOpen,
  buttonText,
  modalTitle,
  modalLabel,
  modalDescription,
  onImageUploadSubmit,
}: ProfileImageModalProps) => {
  const initialValues: ProfileFormValues = {
    file: null,
  }

  return (
    <ModalComponent open={isModalOpen} title={modalTitle} onClose={() => setIsModalOpen(false)} widthClass="max-w-md" footer={null}>
      <Formik
        initialValues={initialValues}
        validate={values => {
          const errors: Partial<Record<keyof ProfileFormValues, string>> = {}
          if (!values.file) {
            errors.file = 'Please select an image file.'
            return errors
          }

          if (!ALLOWED_IMAGE_MIME_TYPES.includes(values.file.type)) {
            errors.file = 'Only image files (JPG, PNG, WEBP, GIF) are allowed.'
          } else if (values.file.size > MAX_FILE_SIZE_BYTES) {
            errors.file = 'Max file size is 5MB.'
          }

          return errors
        }}
        onSubmit={onImageUploadSubmit}
      >
        {({ isSubmitting, setFieldValue, setFieldError, setFieldTouched, values, errors, touched }) => (
          <Form className="space-y-6">
            <p className="text-gray-500 font-medium">{modalDescription}</p>

            {/* File Upload Field */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">{modalLabel}</label>
              <div className="border border-gray-300 rounded-lg px-4 py-3 bg-white cursor-pointer hover:border-red-500 transition-all">
                <input
                  type="file"
                  name="file"
                  accept="image/*"
                  className="w-full text-sm text-gray-600"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const file = e.currentTarget.files?.[0] ?? null
                    setFieldTouched('file', true, false)

                    if (!file) {
                      setFieldValue('file', null)
                      return
                    }

                    if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.type)) {
                      setFieldValue('file', null)
                      setFieldError('file', 'Only image files (JPG, PNG, WEBP, GIF) are allowed.')
                      return
                    }

                    if (file.size > MAX_FILE_SIZE_BYTES) {
                      setFieldValue('file', null)
                      setFieldError('file', 'Max file size is 5MB.')
                      return
                    }

                    setFieldError('file', '')
                    setFieldValue('file', file)
                  }}
                />
              </div>

              <p className="text-xs text-gray-500 mt-2">Only images (JPG, PNG, WEBP, GIF). Max 5MB.</p>

              {touched.file && errors.file && <p className="text-xs text-red-600 mt-2">{errors.file}</p>}

              {/* Show file name */}
              {values.file && <p className="text-xs text-green-600 mt-1">Selected: {values.file.name}</p>}
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100 transition"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting || !values.file || Boolean(errors.file)}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 transition"
              >
                {isSubmitting ? 'Uploading...' : buttonText || 'Upload Logo'}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </ModalComponent>
  )
}

export default UploadProfileImageModal
