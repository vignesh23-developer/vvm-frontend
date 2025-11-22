import * as Yup from 'yup'

const propertyCategorySchema = Yup.object({
  name: Yup.string().min(2, 'Name must be at least 2 characters').required('Property category name is required'),
  icon: Yup.string().required('Icon is required'),
})

export default propertyCategorySchema
