import { FeatureMappingDTO } from './(dto)/land_registration_dto'
import * as Yup from 'yup'

export const generateDynamicSchema = (fields: FeatureMappingDTO[]) => {
  const shape: Record<string, Yup.AnySchema> = {}

  fields.forEach(val => {
    const name = `feature_${val.feature_category_id}`
    const typ = val.input_type

    if (typ.includes('text')) {
      shape[name] = Yup.string().trim().required(`${name} is required`)
    } else if (typ.includes('numeric') || typ.includes('Unit')) {
      shape[name] = Yup.number().typeError(`${name} must be a number`).required(`${name} is required`)
    } else if (typ.includes('boolean')) {
      shape[name] = Yup.boolean().oneOf([true, false], `${name} is required`)
    } else if (typ.includes('single_select')) {
      shape[name] = Yup.string().required(`Please select a value for ${name}`)
    } else if (typ.includes('multi_select')) {
      shape[name] = Yup.array().of(Yup.string().required()).min(1, `Please select at least one ${name}`)
    } else {
      shape[name] = Yup.mixed().required(`${name} is required`)
    }
  })

  return Yup.object().shape(shape)
}
