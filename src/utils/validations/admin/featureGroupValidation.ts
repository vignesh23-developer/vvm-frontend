import * as Yup from 'yup'

const featureGroupSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Property category name is required'),
})
export default featureGroupSchema
