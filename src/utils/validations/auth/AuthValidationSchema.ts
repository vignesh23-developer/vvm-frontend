import * as Yup from 'yup'


// Validation Schema with Yup

export const SignupSchema = Yup.object().shape({
  fullName: Yup.string().required('Full name is required'),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
    .required('Phone number is required'),
  referral: Yup.string().optional(),
})


export const AuthSchema = Yup.object().shape({
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
    .required('Phone number is required'),
})

export const ProfileCreationSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .required("First name is required"),

  lastName: Yup.string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters")
    .required("Last name is required"),

  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
    .required("Phone number is required"),

  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),

  address1: Yup.string()
    .min(5, "Address must be at least 5 characters")
    .required("Address Line 1 is required"),

  address2: Yup.string()
    .max(100, "Address Line 2 must be less than 100 characters")
    .optional(),

  landMark: Yup.string()
    .max(50, "Landmark must be less than 50 characters")
    .optional(),

  postalCode: Yup.string()
    .matches(/^[0-9]{6}$/, "Postal code must be 6 digits")
    .required("Postal code is required"),
})
