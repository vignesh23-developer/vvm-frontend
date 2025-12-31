import * as Yup from 'yup'

// Validation Schema with Yup

export const SignupSchema = (t: any, googleId?: string | null) =>
  Yup.object().shape({
    firstName: Yup.string()
      .min(2, t('form.first_name.error.minLength'))
      .max(50, t('form.first_name.error.maxLength'))
      .required(t('form.first_name.error.required')),

    lastName: Yup.string()
      .min(2, t('form.last_name.error.minLength'))
      .max(50, t('form.last_name.error.maxLength'))
      .required(t('form.last_name.error.required')),

    phone: Yup.string()
      .matches(/^[0-9]{10}$/, t('form.phone_number.error.pattern'))
      .required(t('form.phone_number.error.required')),

    // Email is optional if googleId is present
    email: googleId
      ? Yup.string().email(t('form.email.error.pattern')).optional()
      : Yup.string().email(t('form.email.error.pattern')).required(t('form.email.error.required')),

    // Password is optional if googleId is present
    password: googleId
      ? Yup.string().optional()
      : Yup.string()
          .min(6, 'Password must be at least 6 characters')
          .required('Password is required'),

    // Confirm password is optional if googleId is present
    confirmPassword: googleId
      ? Yup.string().optional()
      : Yup.string()
          .required('Please confirm your password')
          .oneOf([Yup.ref('password')], 'Passwords must match'),

    otp: Yup.array()
      .of(
        Yup.string()
          .matches(/^[0-9]$/, t('form.otp.error.pattern'))
          .required(t('form.otp.error.required')),
      )
      .min(6, t('form.otp.error.length'))
      .max(6, t('form.otp.error.length')),
  })

export const OtpSchema = Yup.object().shape({
  otp: Yup.array()
    .of(
      Yup.string()
        .matches(/^[0-9]$/, 'Must be a number')
        .required('OTP is required'),
    )
    .min(6, 'Enter all 6 digits')
    .max(6, 'Invalid OTP'),
})

export const AuthSchema = (t: any) =>
  Yup.object().shape({
    emailOrPhone: Yup.string()
      .required('Email or phone number is required')
      .test('email-or-phone', 'Please enter a valid email or phone number', function (value) {
        if (!value) return false
        // If contains @, validate as email
        if (value.includes('@')) {
          return Yup.string().email().isValidSync(value)
        }
        // Otherwise validate as phone number (10 digits or international format)
        return /^\+?[1-9]\d{1,14}$/.test(value) || /^[0-9]{10}$/.test(value)
      }),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  })

export const ProfileCreationSchema = (t: any) =>
  Yup.object().shape({
    email: Yup.string().email(t('form.email.error.pattern')).required(t('form.email.error.required')),
    address: Yup.string().min(5, t('form.address.error.minLength')).required(t('form.address.error.required')),
    landMark: Yup.string().max(50, t('form.land_mark.error.maxLength')).optional(),
    postalCode: Yup.string()
      .matches(/^[0-9]{6}$/, t('form.post_code.error.pattern'))
      .required(t('form.post_code.error.required')),
  })
