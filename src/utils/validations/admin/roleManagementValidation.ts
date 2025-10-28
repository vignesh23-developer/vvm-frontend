import * as Yup from 'yup'

const roleManagementSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Role name is required'),
})
export default roleManagementSchema
