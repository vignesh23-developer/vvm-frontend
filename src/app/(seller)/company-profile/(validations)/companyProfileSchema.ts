import * as Yup from 'yup'

export const companyProfileSchema = Yup.object().shape({
  companyName: Yup.string().trim().required('Company name is required'),
  description: Yup.string().trim(),
  gstNumber: Yup.string().trim(),
  profileName: Yup.string()
    .trim()
    .required('Profile name is required')
    .matches(/^(?!.*\/)[^\s]+$/, 'Profile name cannot contain spaces or "/"'),
  contact_name: Yup.string().trim().required('Contact name is required'),
  contact_phone: Yup.string()
    .trim()
    .required('Contact phone is required')
    .matches(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number'),
  contact_email: Yup.string().trim().email('Please enter a valid email address').required('Contact email is required'),
  expiryDays: Yup.number()
    .typeError('Expiry days must be a number')
    .integer('Expiry days must be an integer')
    .min(0, 'Expiry days cannot be negative')
    .required('Expiry days is required'),
  address_line: Yup.string().trim().required('Address line is required'),
  city: Yup.string().trim().required('City is required'),
  district: Yup.string().trim().required('District is required'),
  state: Yup.string().trim().required('State is required'),
  postal_code: Yup.string().trim().required('Postal code is required'),
  country: Yup.string().trim().required('Country is required'),
})
