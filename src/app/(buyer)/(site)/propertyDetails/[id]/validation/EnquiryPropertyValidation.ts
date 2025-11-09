import * as Yup from 'yup'

const EnquiryPropertyValidation = Yup.object().shape({
  name: Yup.string().required('Please enter your name'),
  email: Yup.string().email('Please enter a valid email').required('Please enter your email'),
  phone: Yup.string().required('Please enter your phone number'),
  message: Yup.string().required('Please enter your message'),
})

export default EnquiryPropertyValidation
