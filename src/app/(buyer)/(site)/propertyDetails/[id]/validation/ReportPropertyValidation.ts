import * as Yup from 'yup'

const ReportPropertyValidation = Yup.object().shape({
  report_type: Yup.string().required('Please select a report type'),
  is_anonymous: Yup.boolean(),
  severity: Yup.number().min(1, 'Minimum severity is 1').max(5, 'Maximum severity is 5').required('Please enter a severity'),
  evidenceLink: Yup.string().url('Must be a valid URL').nullable(),
})

export default ReportPropertyValidation
