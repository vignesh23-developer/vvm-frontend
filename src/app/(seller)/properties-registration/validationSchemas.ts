'use client'

import * as Yup from 'yup'

export function getPropertyStepValidationSchema(step: number, isLayout: boolean): Yup.ObjectSchema<any> | Yup.MixedSchema<any> {
  switch (step) {
    case 1:
      return Yup.object().shape({
        propertyTitle: Yup.string().trim().required('Property title is required'),
        propertyType: Yup.string().required('Property type is required'),
        purpose: Yup.string().required('Purpose is required'),
        description: Yup.string().trim().required('Property description is required'),
        ...(isLayout
          ? {
              project_status: Yup.string()
                .oneOf(['CURRENT', 'UPCOMING', 'COMPLETED'])
                .required('Project status is required'),
            }
          : {}),
      })

    case 2:
      return Yup.object().shape({
        door_number: Yup.string().trim().optional().notRequired(),
        street_name: Yup.string().trim().optional().notRequired(),
        address_line: Yup.string().trim().required('Address line is required'),
        city: Yup.string().trim().optional().notRequired(),
        district: Yup.string().trim().required('District is required'),
        state: Yup.string().oneOf(['Tamil Nadu'], 'State must be Tamil Nadu'),
        postal_code: Yup.string().trim().optional().notRequired(),
        country: Yup.string().oneOf(['India'], 'Country must be India'),
        latitude: Yup.number().optional().notRequired(),
        longitude: Yup.number().optional().notRequired(),
        ...(isLayout
          ? {
              layout_price_min: Yup.number()
                .typeError('Layout price min must be a number')
                .positive('Layout price min must be greater than zero')
                .required('Layout price min is required'),
              layout_area_min_sqft: Yup.number()
                .typeError('Layout area min must be a number')
                .positive('Layout area min must be greater than zero')
                .required('Layout area min is required'),
              layout_area_unit: Yup.string().trim().required('Layout area unit is required'),
              plot_total_count: Yup.number()
                .typeError('Must be a number')
                .min(1, 'Must be at least 1')
                .optional()
                .test(
                  'total-plots-check',
                  'Total plots must be \u2265 sum of available, sold & booked plots',
                  function (value) {
                    if (value === undefined || value === null) return true;
                    const available = Number(this.parent.plot_available_count) || 0;
                    const sold = Number(this.parent.plot_sold_count) || 0;
                    const booked = Number(this.parent.plot_booked_count) || 0;
                    return value >= (available + sold + booked);
                  }
                ),
              plot_available_count: Yup.number().typeError('Must be a number').min(0, 'Cannot be negative').optional(),
              plot_sold_count: Yup.number().typeError('Must be a number').min(0, 'Cannot be negative').optional(),
              plot_booked_count: Yup.number().typeError('Must be a number').min(0, 'Cannot be negative').optional(),
            }
          : {
              price: Yup.number()
                .typeError('Price must be a number')
                .positive('Price must be greater than zero')
                .required('Price is required'),
              size: Yup.number()
                .typeError('Size must be a number')
                .positive('Size must be greater than zero')
                .required('Size is required'),
              unit: Yup.string().trim().required('Unit is required'),
            }),
      })

    case 3:
      return Yup.mixed({}).notRequired().nonNullable()

    case 4:
      return Yup.object().shape({
        uploadType: Yup.string().oneOf(['chooseFromDevice', 'addViaLink']).required('Upload type is required'),
        propertyPhoto: Yup.array().when('uploadType', (uploadTypeValue, schema) => {
          if (uploadTypeValue.includes('addViaLink')) {
            return schema
              .of(
                Yup.object().shape({
                  media_type: Yup.string().oneOf(['VIDEO', 'IMAGE']).required('Media type is required'),
                  title: Yup.string().required('Title is required'),
                  url: Yup.string().required('URL is required'),
                  is_primary: Yup.boolean(),
                }),
              )
              .min(1, 'At least one property photo is required')
          }
          return schema.notRequired()
        }),
        localpropertyPhoto: Yup.object().when('uploadType', (uploadTypeValue, schema) => {
          if (uploadTypeValue.includes('chooseFromDevice')) {
            return schema.shape({
              files: Yup.array().of(Yup.mixed().required('File is required')).min(1, 'At least one file is required'),
            })
          }
          return schema.notRequired()
        }),
      })

    default:
      return Yup.object().shape({})
  }
}
