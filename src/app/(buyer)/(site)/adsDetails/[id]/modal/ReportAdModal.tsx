'use client'

import { Formik, Form } from 'formik'
import { toast } from 'react-hot-toast'

import ModalComponent from '@/components/ui/CustomComponent/Modal/ModalComponent'
import Button from '@/components/ui/CustomComponent/Button/Button'
import FormikSelectField from '@/components/ui/Formik/FormikSelectField/FormikSelectField'
import FormikTextField from '@/components/ui/Formik/FormikTextField/FormikTextField'
import FormikCheckboxField from '@/components/ui/Formik/FormikCheckboxField/FormikCheckboxField'

import { appEndpoints } from '@/services/endpoints'
import { postMethod } from '@/services/service'
import ReportPropertyValidation from '@/app/(buyer)/(site)/propertyDetails/[id]/validation/ReportPropertyValidation'

interface ReportAdModalProps {
  open: boolean
  onClose: () => void
  adId: string
}

const REPORT_OPTIONS = [
  { value: 'FAKE_LISTING', label: 'Fake Listing' },
  { value: 'INAPPROPRIATE_CONTENT', label: 'Inappropriate Content' },
]

export default function ReportAdModal({ open, onClose, adId }: ReportAdModalProps) {
  const initialValues = {
    report_type: 'FAKE_LISTING',
    description: '',
    is_anonymous: true,
    evidenceLink: '',
    severity: 3,
  }

  const handleSubmit = async (values: typeof initialValues, { resetForm }: any) => {
    const payload = {
      report_type: values.report_type,
      description: values.description,
      is_anonymous: values.is_anonymous,
      severity: Number(values.severity),
    }

    try {
      const response = await postMethod(appEndpoints.createAdReport(adId), payload)
      if (response.error) {
        toast.error(response.message || 'Failed to submit report')
        return
      }
      toast.success('Report submitted successfully')
      resetForm()
      onClose()
    } catch (err) {
      console.error('Failed to submit ad report', err)
      toast.error('Unable to submit report')
    }
  }

  return (
    <ModalComponent open={open} onClose={onClose} title="Report Ad" widthClass="max-w-md" footer={null}>
      <Formik initialValues={initialValues} validationSchema={ReportPropertyValidation} onSubmit={handleSubmit}>
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <p className="text-sm text-gray-600">Provide the reason for reporting this ad.</p>

            <FormikSelectField label="Report Type" name="report_type" options={REPORT_OPTIONS} />

            <FormikTextField name="description" label="Description" as="textarea" rows={4} placeholder="Describe the issue" />

            <FormikCheckboxField name="is_anonymous" label="Submit anonymously" />

            <FormikTextField name="severity" label="Severity (1-5)" type="number" placeholder="Enter a value between 1 and 5" />

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" onClick={onClose} className="border border-gray-300 text-gray-700 px-4 py-2 text-sm">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-[#7B1E1E] text-white px-4 py-2 text-sm">
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </ModalComponent>
  )
}
