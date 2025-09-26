import * as Yup from 'yup'

// Validation Schema with Yup

export const AgencyEnquirySchema = (t: any) =>
  Yup.object().shape({
    name: Yup.string()
      .min(2, t("form.name.error.minLength"))
      .max(50, t("form.name.error.maxLength"))
      .required(t("form.name.error.required")),

    email: Yup.string()
        .email(t("form.email.error.pattern"))
        .required(t("form.email.error.required")),

    phone: Yup.string()
      .matches(/^[0-9]{10}$/, t("form.phone_number.error.pattern"))
      .required(t("form.phone_number.error.required")),

    message: Yup.string().required(t("form.message.error.required")),
  })