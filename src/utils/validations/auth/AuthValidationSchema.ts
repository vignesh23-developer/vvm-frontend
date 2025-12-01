import * as Yup from 'yup'

// Validation Schema with Yup

export const SignupSchema = (t: any) =>
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

    email: Yup.string().email(t('form.email.error.pattern')).required(t('form.email.error.required')),

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
    phone: Yup.string()
      .matches(/^[0-9]{10}$/, t('form.phone_number.error.pattern'))
      .required(t('form.phone_number.error.required')),
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
