import * as Yup from 'yup'

const adsCategorySchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Ads category name is required'),
})
export default adsCategorySchema
