import * as Yup from 'yup'

export const FeatureCategoryValidationSchema = Yup.object({
  code: Yup.string().required('Code is required'),
  name: Yup.string().required('Name is required'),
  inputType: Yup.string().required('Input type is required'),
  // options: Yup.array()
  //   .of(
  //     Yup.object({
  //       name: Yup.string().required('Option name is required'),
  //       value: Yup.string().required('Option value is required'),
  //       sortOrder: Yup.number().required('Sort order is required'),
  //       isActive: Yup.boolean(),
  //     }),
  //   )
  //   .min(1, 'At least one option is required'),
})
