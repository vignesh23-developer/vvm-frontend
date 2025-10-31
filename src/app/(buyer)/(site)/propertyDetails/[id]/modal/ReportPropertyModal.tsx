import React from 'react'
import ModalComponent from '@/components/ui/CustomComponent/Modal/ModalComponent'
import { Formik, Form } from 'formik'
import { toast } from 'react-hot-toast'
import Button from '@/components/ui/CustomComponent/Button/Button'
import FormikSelectField from '@/components/ui/Formik/FormikSelectField/FormikSelectField'
import FormikTextField from '@/components/ui/Formik/FormikTextField/FormikTextField'
import FormikCheckboxField from '@/components/ui/Formik/FormikCheckboxField/FormikCheckboxField'
import ReportPropertyValidation from '../validation/ReportPropertyValidation'
import { postMethod } from '@/services/service'
import { appEndpoints } from '@/services/endpoints'

interface ReportPropertyModalProps {
  reportModalOpen: boolean
  setReportModalOpen: (open: boolean) => void
  propertyId: string | number
}

const ReportPropertyModal = ({
  reportModalOpen,
  setReportModalOpen,
  propertyId,
}: ReportPropertyModalProps) => {
  const options = [
    { value: 'FAKE_LISTING', label: 'Fake Listing' },
    { value: 'MISLEADING_INFO', label: 'Misleading Information' },
    { value: 'SCAM_ACTIVITY', label: 'Scam / Fraudulent Activity' },
    { value: 'OTHER', label: 'Other' },
  ]

  const initialValues = {
    report_type: 'FAKE_LISTING',
    description: '',
    is_anonymous: false,
    severity: 3,
    evidenceLink: '',
  }

  const handleReportSubmit = async (values: any, { resetForm }: any) => {
    const payload = {
      report_type: values.report_type,
      description: values.description,
      is_anonymous: values.is_anonymous,
      severity: Number(values.severity),
      evidence: { links: values.evidenceLink ? [values.evidenceLink] : [] },
    }

    console.log('Report Payload:', payload)

    try {
      await postMethod(
        appEndpoints.createPropertyReport(propertyId as string),
        payload,
      )
      toast.success('Report submitted successfully!')
      resetForm()
      setReportModalOpen(false)
    } catch (error) {
      toast.error('Failed to submit report')
    }
  }
  return (
    <div>
      <ModalComponent
        open={reportModalOpen}
        title="Report Property"
        onClose={() => setReportModalOpen(false)}
        widthClass="max-w-md"
        footer={null}
      >
        <Formik
          initialValues={initialValues}
          validationSchema={ReportPropertyValidation}
          onSubmit={handleReportSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <p className="text-gray-700 font-medium">
                Please specify the reason for reporting this property:
              </p>

              {/* Report Type */}
              <div>
                <FormikSelectField
                  label="Report Type"
                  name="report_type"
                  options={options}
                />
              </div>

              {/* Description */}
              <div>
                <FormikTextField
                  label="Description"
                  as="textarea"
                  name="description"
                  placeholder="Enter your reason..."
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                />
              </div>

              {/* Anonymous Option */}
              <div className="flex items-center space-x-2">
                <FormikCheckboxField
                  label="Submit anonymously"
                  name="is_anonymous"
                  className="rounded border-gray-300"
                />
              </div>

              {/* Evidence Links */}
              <div>
                <FormikTextField
                  type="url"
                  label="Evidence Link (optional)"
                  name="evidenceLink"
                  placeholder="https://example.com/proof"
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                />
              </div>

              {/* Severity */}
              <div>
                <FormikTextField
                  type="number"
                  label="Severity"
                  name="severity"
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  onClick={() => setReportModalOpen(false)}
                  className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  onClick={() => {}}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </ModalComponent>
    </div>
  )
}

export default ReportPropertyModal
