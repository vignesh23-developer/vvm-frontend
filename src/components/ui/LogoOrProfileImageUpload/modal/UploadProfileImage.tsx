'use client'

import { useRouter } from 'next/navigation'
import ModalComponent from '@/components/ui/CustomComponent/Modal/ModalComponent'
import { Formik, Form } from 'formik'
import Button from '@/components/ui/CustomComponent/Button/Button'

interface ProfileImageModalProps {
  isModalOpen: boolean
  setIsModalOpen: (open: boolean) => void
  buttonText?: string
  onImageUploadSubmit: (values: ProfileFormValues, helpers: any) => void
}

interface ProfileFormValues {
  file: File | null
}

const UploadProfileImageModal = ({ isModalOpen, setIsModalOpen, buttonText, onImageUploadSubmit }: ProfileImageModalProps) => {
  const router = useRouter()
  const initialValues: ProfileFormValues = {
    file: null,
  }

  return (
    <ModalComponent open={isModalOpen} title="Upload Company Logo" onClose={() => setIsModalOpen(false)} widthClass="max-w-md" footer={null}>
      <Formik initialValues={initialValues} onSubmit={onImageUploadSubmit}>
        {({ isSubmitting, setFieldValue, values }) => (
          <Form className="space-y-6">
            <p className="text-gray-500 font-medium">Kindly upload your company logo below 👇</p>

            {/* File Upload Field */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">Company Logo</label>

              <div className="border border-gray-300 rounded-lg px-4 py-3 bg-white cursor-pointer hover:border-red-500 transition-all">
                <input
                  type="file"
                  name="file"
                  className="w-full text-sm text-gray-600"
                  onChange={(e: any) => setFieldValue('file', e.target.files[0])}
                />
              </div>

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
                disabled={isSubmitting}
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
