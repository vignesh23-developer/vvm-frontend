'use client'
import { CheckCircle, ContactRound, Home, MapPin, Star, Camera, Check, ArrowRight, ArrowLeft } from 'lucide-react'
import { SetStateAction, startTransition, use, useActionState, useEffect, useState, useTransition } from 'react'
import { Formik, Form, FormikHelpers } from 'formik'
import * as Yup from 'yup'

// Step components
import Step3ContactDetails from './(views)/ContactDetails'
import Step1BasicDetails from './(views)/BasicDetails'
import Step2LocationPrice from './(views)/LocationPrice'
import Step4FeaturesAmenities from './(views)/FeaturesAmenities'
import Step5PhotosContact from './(views)/PhotosContact'
import Step6ReviewSubmit from './(views)/ReviewSubmit'
import useLandRegistration, { PropertyCategoryFeatureMappingResponse } from './(hook)/properties_registration_hook'
import { FeatureMappingDTO, FeaturePayloadDTO, LandRegistrationPayloadDTO } from './(dto)/properties_registration_dto'

import toast from 'react-hot-toast'
import { ResponseDTO } from '@/components/dto/response_dto'
import { onAddPropertyMedia, onCreateProperty, onUpdateProperty } from './(action)/properties_registration_action'
import { getLocalStorageItem, removeLocalStorageItem, setLocalStorageItem } from '@/utils/local_storage/local_storage_handler'
import { LOCAL_STORAGE_NAME } from '@/utils/local_storage/local_storage_constant'
import { getMethod } from '@/services/service'
import { appEndpoints } from '@/services/endpoints'
import Button from '@/components/ui/CustomComponent/Button/Button'
// import Step5UploadImages from './(views)/UploadImages'

const mapFeatureValuesToPayload = (featureValues: any[] | undefined, mappings: FeatureMappingDTO[] | null): FeaturePayloadDTO[] => {
  if (!Array.isArray(featureValues)) {
    return []
  }

  return featureValues
    .map(feature => {
      const categoryId = feature?.feature_category?.id ?? feature?.feature_category_id ?? feature?.category_id

      if (!categoryId) {
        return null
      }

      const mapping = mappings?.find(m => m.feature_category_id === categoryId)
      const inputType = mapping?.input_type ?? feature?.feature_category?.input_type ?? ''

      let optionIds: string[] = []
      let valueText: string | undefined
      let valueNumber: number | undefined

      if (inputType.includes('boolean')) {
        const rawBoolean = feature?.value_boolean ?? feature?.value ?? feature?.display_value
        let boolValue = false
        if (typeof rawBoolean === 'boolean') {
          boolValue = rawBoolean
        } else if (typeof rawBoolean === 'string') {
          boolValue = rawBoolean.toLowerCase() === 'true' || rawBoolean === '1'
        } else if (typeof rawBoolean === 'number') {
          boolValue = rawBoolean === 1
        }
        optionIds = [String(boolValue)]
      } else if (inputType.includes('text')) {
        const rawText = feature?.value_text ?? feature?.display_value ?? feature?.value
        valueText = typeof rawText === 'string' ? rawText : rawText != null ? String(rawText) : ''
      } else if (inputType.includes('numeric')) {
        const rawNumber = feature?.value_number ?? feature?.display_value ?? feature?.value
        const parsed = typeof rawNumber === 'number' ? rawNumber : Number(rawNumber)
        valueNumber = Number.isFinite(parsed) ? parsed : undefined
      } else {
        if (Array.isArray(feature?.option_ids)) {
          optionIds = feature.option_ids.map((id: any) => String(id))
        } else if (Array.isArray(feature?.feature_options)) {
          optionIds = feature.feature_options.map((opt: any) => String(opt?.id ?? opt?.option_id ?? opt))
        } else if (feature?.option_id) {
          optionIds = [String(feature.option_id)]
        }
      }

      const groupId = feature?.feature_group?.id ?? feature?.feature_group_id ?? feature?.group_id ?? mapping?.feature_group_id ?? null

      return new FeaturePayloadDTO({
        feature_category_id: categoryId,
        feature_group_id: groupId,
        option_ids: optionIds,
        value_text: valueText,
        value_number: valueNumber,
        is_mandator: mapping?.is_mandatory ?? feature?.is_mandatory ?? false,
      })
    })
    .filter(Boolean) as FeaturePayloadDTO[]
}

interface Amenity {
  id: string
  name: string
  selected: boolean
}

type PurposeType = 'Sale' | 'Rent' | 'Lease'

export type LocalPropertyPhotoPayloadItem = {
  // metadata only (serializable) — the actual File objects live in localpropertyPhoto.files
  is_primary: boolean
  title: string
  media_type: 'IMAGE' | 'VIDEO'
  sort_order: number
  media_category: string
}

// Types for your combined form data (include all steps)
export interface PropertyCreationFormValues {
  // Step 1
  propertyTitle: string
  propertyType: string
  purpose: string
  description: string

  // Step 2
  door_number: string
  street_name: string
  address_line: string
  city: string
  district: string
  state: string // default "Tamil Nadu"
  postal_code: string
  country: string // maybe default "India"
  price: number | string
  size: number | string
  unit: string
  latitude: number
  longitude: number

  // Step 3
  contactName: string
  contactNumber: string
  contactEmail: string

  // Step 4
  option_ids: Array<string>
  // amenities: string[] — we might collect selected amenity names

  // Step 5
  uploadType: string
  propertyPhoto: Array<{
    media_type: string
    url: string
    title: string
    is_primary: boolean
  }>

  localpropertyPhoto: {
    files: Array<File>
    payload: Array<LocalPropertyPhotoPayloadItem>
  }
  boostListing: boolean
  uploadedFiles: File[] // maybe just store File[] or previews

  features: Array<FeaturePayloadDTO>
  // you could also include step5 review constraints
}

interface userData {
  id: string
  firstName: string
  lastName: string
  email: string
  agent: {
    agent_id: string
    agent_name: string
    agent_profile_name: string
  }
}

export default function PropertiesRegistrationPage({ propertiesId }: { propertiesId?: string }) {
  const steps = [
    { title: 'Step 1', subtitle: 'Basic Details', icon: <Home className="w-5 h-5" /> },
    { title: 'Step 2', subtitle: 'Location & Price', icon: <MapPin className="w-5 h-5" /> },
    { title: 'Step 3', subtitle: 'Contact Details', icon: <ContactRound className="w-5 h-5" /> },
    { title: 'Step 4', subtitle: 'Features & Amenities', icon: <Star className="w-5 h-5" /> },
    { title: 'Step 5', subtitle: 'Photos', icon: <Camera className="w-5 h-5" /> },
    { title: 'Step 6', subtitle: 'Review & Submit', icon: <Check className="w-5 h-5" /> },
  ]
  const {
    propertyCategoryData,
    propertyCategoryFetchLoader,
    propertyCategoryFetchErr,
    propertyCategoryRefresh,
    onGetPropertyCategoryFeatureMapping,
  } = useLandRegistration()

  const [userValue, setUserValue] = useState<userData | null>(null)

  useEffect(() => {
    const authToken = getLocalStorageItem('authToken')
    const userData = getLocalStorageItem('userData') as userData

    if (authToken && userData) {
      const user = {
        id: userData?.id,
        firstName: userData?.firstName,
        lastName: userData?.lastName,
        email: userData?.email,
        agent: {
          agent_id: userData?.agent?.agent_id,
          agent_name: userData?.agent?.agent_name,
          agent_profile_name: userData?.agent?.agent_profile_name,
        },
      }
      setUserValue(user)
    }
  }, [])
  const [valueData, setValueData] = useState<any>(null)
  const fectchPropertiesById = async (id: string | undefined) => {
    if (id) {
      const res = (await getMethod(appEndpoints.getPropertiesByID(id as string))) as ResponseDTO<any>
      console.log('property by id res:', res.data)
      setValueData(res?.data)
    }
  }

  useEffect(() => {
    fectchPropertiesById(propertiesId)
  }, [propertiesId])

  const [currentStep, setCurrentStep] = useState(1)
  const [featureData, setFeatureData] = useState<Array<FeatureMappingDTO> | null>(null)
  const [inputFeatureData, setInputFeatureData] = useState<Array<FeaturePayloadDTO> | null>(null)

  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [uploadCompleted, setUploadCompleted] = useState<boolean>(false)

  const initialValues: PropertyCreationFormValues = {
    contactName: '',
    contactNumber: '',
    contactEmail: '',

    propertyTitle: '',
    propertyType: '',
    purpose: '',
    description: '',

    door_number: '',
    street_name: '',
    address_line: '',
    city: '',
    district: '',
    state: 'Tamil Nadu', // default "Tamil Nadu"
    postal_code: '',
    country: 'India', // maybe default "India"
    price: '',
    size: '',
    unit: 'Sqft',

    latitude: 0,
    longitude: 0,

    // Step3: we’ll handle amenities selection differently
    option_ids: [],

    uploadType: '',
    propertyPhoto: [
      {
        media_type: '',
        url: '',
        title: '',
        is_primary: false,
      },
    ],

    localpropertyPhoto: {
      files: [],
      payload: [],
    },

    boostListing: false,
    uploadedFiles: [],

    features: [],
  }

  // Validation schemas per step
  const validationSchemas: { [key: number]: Yup.ObjectSchema<any, Yup.AnyObject, any> | any } = {
    // STEP 1: (Correct - No changes)
    1: Yup.object().shape({
      propertyTitle: Yup.string().trim().required('Property title is required'),
      propertyType: Yup.string().required('Property type is required'),
      purpose: Yup.string().required('Purpose is required'),
      description: Yup.string().trim().required('Property description is required'),
    }),

    // STEP 2: (Correct - No changes)
    2: Yup.object().shape({
      // door_number: Yup.string().trim().required('Door number is required'),
      // street_name: Yup.string().trim().required('Street name is required'),
      door_number: Yup.string().trim().optional().notRequired(),
      street_name: Yup.string().trim().optional().notRequired(),
      address_line: Yup.string().trim().required('Address line is required'),
      // city: Yup.string().trim().required('City is required'),
      // district: Yup.string().trim().required('District is required'),
      city: Yup.string().trim().optional().notRequired(),
      district: Yup.string().trim().optional().notRequired(),
      state: Yup.string().oneOf(['Tamil Nadu'], 'State must be Tamil Nadu'),
      // postal_code: Yup.string().trim().required('Postal code is required'),
      postal_code: Yup.string().trim().optional().notRequired(),
      country: Yup.string().oneOf(['India'], 'Country must be India'),
      price: Yup.number().typeError('Price must be a number').positive('Price must be greater than zero').required('Price is required'),
      size: Yup.number().typeError('Size must be a number').positive('Size must be greater than zero').required('Size is required'),
      unit: Yup.string().trim().required('Unit is required'),
      latitude: Yup.number().optional().notRequired(),
      longitude: Yup.number().optional().notRequired(),
    }),

    // STEP 3: (Corrected - Contact rules removed)

    3: Yup.object().shape({
      contactName: Yup.string().trim().required('Contact name is required'),
      contactNumber: Yup.string()
        .trim()
        .required('Contact number is required')
        .matches(/^[0-9]{10}$/, 'Please enter a valid 10-digit contact number'),
      // .matches(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number'),
      contactEmail: Yup.string().email('Invalid email address').required('Contact email is required'),
    }),

    // STEP 4: (Correct - No changes)
    4: Yup.mixed({}).notRequired().nonNullable(),

    // STEP 5: (Corrected - Photo rules + Contact rules)
    5: Yup.object().shape({
      // Photo Upload Logic (from your original schema)
      uploadType: Yup.string().oneOf(['chooseFromDevice', 'addViaLink']).required('Upload type is required'),

      propertyPhoto: Yup.array().when('uploadType', (uploadTypeValue, schema) => {
        if (uploadTypeValue.includes('addViaLink')) {
          return schema
            .of(
              Yup.object().shape({
                media_type: Yup.string().oneOf(['VIDEO', 'IMAGE']).required('Media type is required'),
                title: Yup.string().required('Title is required'),
                url: Yup.string().required('URL is required'),
                is_primary: Yup.boolean().transform((value, originalValue) => {
                  // Check if the incoming value is an array (like ["on"] or [])

                  if (Array.isArray(originalValue)) {
                    // If it's ["on"], length is 1, returns true.
                    // If it's [], length is 0, returns false.
                    return originalValue.length > 0
                  }

                  // Fallback for undefined, null, or already correct booleans
                  return value
                }),
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
    }),

    // STEP 6: (Review step, likely no validation needed)
    6: Yup.object().shape({}),
  }

  const isLastStep = currentStep === steps.length

  // on create property init state
  const LRActionInitState: ResponseDTO = new ResponseDTO({ error: false, data: null, message: '', status: '', success: false })

  // on update property init state
  const ULRActionInitState: ResponseDTO = new ResponseDTO({ error: false, data: null, message: '', status: '', success: false })

  // on add property media init state
  const UPPActionInitState: ResponseDTO = new ResponseDTO({ error: false, data: null, message: '', status: '', success: false })

  const [LRActionState, LRAction, LRIsPending] = useActionState<ResponseDTO<any>, any>(onCreateProperty, LRActionInitState)

  const [ULRActionState, ULRAction, ULRIsPending] = useActionState<ResponseDTO<any>, any>(onUpdateProperty, LRActionInitState)

  useEffect(() => {
    if (ULRActionState?.error) {
      toast.error('Faild to Update Property')
    }
    if (ULRActionState?.success) {
      toast.success('Property Updated Successfully')
      console.log('property id:', ULRActionState?.data?.id)
      setLocalStorageItem(LOCAL_STORAGE_NAME.propertyId, ULRActionState?.data?.id)
      setCurrentStep(step => step + 1)
      setIsEdit(true)
    }
  }, [ULRActionState])

  useEffect(() => {
    if (LRActionState?.error) {
      toast.error('Faild to create Property')
    }
    if (LRActionState?.success) {
      toast.success('Property Created Successfully')
      console.log('property id:', LRActionState?.data?.id)
      setLocalStorageItem(LOCAL_STORAGE_NAME.propertyId, LRActionState?.data?.id)
      setCurrentStep(step => step + 1)
      setIsEdit(true)
    }
  }, [LRActionState])

  const [UPPActionState, UPPAction, UPPIsPending] = useActionState<
    ResponseDTO<any>,
    { id: any; payload: any; uploadType: 'chooseFromDevice' | 'addViaLink' }
  >(onAddPropertyMedia, UPPActionInitState)

  useEffect(() => {
    if (UPPActionState?.error) {
      toast.error('Faild to create Property')
    }
    if (UPPActionState?.success) {
      toast.success('Property Media Added Successfully')
      // mark upload as completed so the Next button can be enabled
      setUploadCompleted(true)
      setIsEdit(true)
    }
  }, [UPPActionState])

  useEffect(() => {}, [])

  const handleSubmit = async (values: PropertyCreationFormValues, actions: FormikHelpers<PropertyCreationFormValues>) => {
    try {
      // Validate only the schema for the current step
      await validationSchemas[currentStep].validate(values, { abortEarly: false })

      if (isLastStep) {
        actions.setSubmitting(false)
      } else {
        // here for each step store the data on local
        if (currentStep === 1) {
          // setLocalStorageItem(LOCAL_STORAGE_NAME?.propertyDetails, JSON.stringify(values))
        } else if (currentStep === 2) {
          // setLocalStorageItem(LOCAL_STORAGE_NAME?.propertyDetails, JSON.stringify(values))
        } else if (currentStep === 3) {
          // setLocalStorageItem(LOCAL_STORAGE_NAME?.propertyDetails, JSON.stringify(values))
        } else if (currentStep === 4) {
          // setLocalStorageItem(LOCAL_STORAGE_NAME?.propertyDetails, JSON.stringify(values))
        }

        if (currentStep === 4 && featureData) {
          // Extract all mandatory feature category IDs
          const mandatoryFeatures = featureData.filter(val => val.is_mandatory)
          const mandatoryIds = mandatoryFeatures.map(f => f.feature_category_id)
          const selectedFeatures = (values.features?.length ? values.features : inputFeatureData ?? []) as FeaturePayloadDTO[]

          // Find which mandatory features are filled by user
          const filledMandatory = mandatoryIds.filter(id => {
            const feature = selectedFeatures.find(f => f.feature_category_id === id)
            if (!feature) return false

            // Check if the value is actually filled depending on input type
            return (
              (feature.value_text && feature.value_text.trim() !== '') ||
              feature.value_number !== undefined ||
              (Array.isArray(feature.option_ids) && feature.option_ids.length > 0)
            )
          })

          if (filledMandatory.length < mandatoryIds.length) {
            toast.error('Please fill all mandatory fields before continuing.')
            return
          }
        }

        if (currentStep === 4 && featureData) {
          // Proceed when mandatory selection requirement is satisfied
          const selectedFeatures = (values.features?.length ? values.features : inputFeatureData ?? []) as FeaturePayloadDTO[]
          const LandRegistrationData: LandRegistrationPayloadDTO = new LandRegistrationPayloadDTO({
            contact_name: values?.contactName,
            contact_phone: values?.contactNumber,
            contact_email: values?.contactEmail,
            title: values?.propertyTitle,
            description: values?.description,
            property_category_id: values?.propertyType,
            price: values?.price as number,
            property_size: values?.size as number,
            property_size_unit: values?.unit,
            listing_type: values?.purpose,
            door_number: values?.door_number,
            street_name: values?.street_name,
            address_line: values?.address_line,
            city: values?.city,
            district: values?.district,
            state: values?.state,
            postal_code: values?.postal_code,
            country: values?.country,
            latitude: values?.latitude,
            longitude: values?.longitude,
            agent_id: userValue?.agent?.agent_id || '',
            // Ensure each feature is an instance of FeaturePayloadDTO so `toObject()` exists at runtime.
            features: selectedFeatures.map((feature: FeaturePayloadDTO) =>
              feature instanceof FeaturePayloadDTO ? feature : new FeaturePayloadDTO(feature as any),
            ),
          })

          var payload = LandRegistrationData?.toObject()

          const localStroagePropertyId = (await getLocalStorageItem(LOCAL_STORAGE_NAME?.propertyId)) as any

          console.log('log on data sss properties:', localStroagePropertyId, propertiesId)

          if (localStroagePropertyId || propertiesId) {
            startTransition(async () => {
              ULRAction({ payload, propertiesId: propertiesId ? propertiesId : localStroagePropertyId })
            })
          } else {
            startTransition(async () => {
              LRAction({ payload, userId: userValue?.id })
            })
          }
          return
        }

        if (currentStep === 5) {
          const localPropertyId = getLocalStorageItem(LOCAL_STORAGE_NAME?.propertyId) as any
          console.log(localPropertyId, 'local')
          const propertyId = propertiesId ? propertiesId : localPropertyId
          console.log('Step 5 submit - propertyId:', propertyId, propertiesId, localPropertyId, 'uploadType:', values?.uploadType)

          if (!propertyId || !values?.uploadType) {
            console.error('Missing propertyId or uploadType')
            actions.setSubmitting(false)
            return
          }

          if (values?.uploadType === 'chooseFromDevice' && values?.localpropertyPhoto?.payload) {
            const localFiles = values?.localpropertyPhoto?.files || []
            const payload = values?.localpropertyPhoto?.payload || []

            if (localFiles.length === 0) {
              console.warn('No files selected for upload')
              actions.setSubmitting(false)
              return
            }

            setUploadCompleted(false)
            actions.setSubmitting(true)

            try {
              const formData = new FormData()

              localFiles.forEach((file, index) => {
                const meta = payload[index] || {}

                formData.append('files', file)
                formData.append('media_type', meta.media_type ?? '')
                formData.append('title', meta.title ?? '')
                formData.append('is_primary', String(meta.is_primary ?? false))
                formData.append('media_category', meta.media_category ?? '')
                formData.append('sort_order', String(meta.sort_order ?? index))
              })

              console.log('Uploading all files together...', propertyId)

              startTransition(() => {
                UPPAction({
                  id: propertyId,
                  payload: formData,
                  uploadType: 'chooseFromDevice',
                })
              })

              console.log('All files uploaded successfully!')
            } catch (error) {
              console.error('Error uploading files:', error)
            } finally {
              actions.setSubmitting(false)
            }
          } else if (values?.uploadType === 'addViaLink' && values?.propertyPhoto) {
            const linkPayload = values.propertyPhoto
            console.log('Uploading via addViaLink:', linkPayload)

            actions.setSubmitting(true)
            try {
              startTransition(() => {
                UPPAction({ id: propertyId, payload: linkPayload, uploadType: 'addViaLink' })
              })
            } catch (error) {
              console.error('Error uploading via link:', error)
            } finally {
              actions.setSubmitting(false)
            }
          }

          return
        }

        // advance to next step
        setCurrentStep(step => step + 1)
        // clear touched so next step has fresh state
        actions.setTouched({})
        actions.setSubmitting(false)
      }
    } catch (err) {
      console.log('step 6', err)
      if (err instanceof Yup.ValidationError) {
        const errors: { [field: string]: string } = {}
        err.inner.forEach(e => {
          if (e.path) {
            errors[e.path] = e.message
          }
        })
        actions.setErrors(errors)
        actions.setSubmitting(false)
      }
    }
  }

  return (
    <div className="w-full px-4 py-6">
      {/* Progress Stepper same as your markup */}
      <div className="flex flex-col items-center px-4 py-6">
        <p className="mb-6 text-lg text-gray-600 text-center max-w-md">Reach thousands of potential buyers and tenants</p>

        <div className="flex w-full max-w-5xl justify-between items-start relative">
          {steps.map((step, idx) => {
            const stepIndex = idx + 1
            const isActive = stepIndex === currentStep
            const isCompleted = stepIndex < currentStep
            const isLast = idx === steps.length - 1

            return (
              <div key={idx} className="flex flex-col items-center flex-1 relative group">
                {/* Connector line */}
                {!isLast && (
                  <div
                    className={`absolute top-5 left-1/2 right-[-50%] h-0.5 transition-all duration-300
              ${isCompleted ? 'bg-[#7B1E1E]' : 'bg-gray-300 group-hover:bg-gray-400'}`}
                  />
                )}

                {/* Step Circle */}
                <div
                  className={`relative flex items-center justify-center w-12 h-12 rounded-full border-2 text-sm font-semibold
            transition-all duration-300 shadow-sm
            ${
              isCompleted
                ? 'bg-[#7B1E1E] border-[#7B1E1E] text-white'
                : isActive
                ? 'bg-white border-[#7B1E1E] text-[#7B1E1E] shadow-md scale-110'
                : 'bg-white border-gray-300 text-gray-400 group-hover:border-gray-400'
            }`}
                >
                  {isCompleted ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step.icon
                  )}
                </div>

                {/* Step Label */}
                <div className="mt-3 text-center">
                  <p className={`text-sm font-semibold tracking-wide ${isActive ? 'text-gray-900' : 'text-gray-600'}`}>{step.title}</p>
                  <p className={`text-xs mt-1 ${isActive ? 'text-gray-500' : 'text-gray-400'}`}>{step.subtitle}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <Formik initialValues={initialValues} validationSchema={validationSchemas[currentStep]} onSubmit={handleSubmit}>
        {formik => {
          async function init() {
            // 1) Check for local draft first
            // const localStoradData: any = await getLocalStorageItem(LOCAL_STORAGE_NAME.propertyDetails)

            // console.log('localstorad val:', localStoradData)

            // if (localStoradData) {
            //   const storadPropertyData: PropertyCreationFormValues = JSON.parse(localStoradData)
            //   console.log('localstorad val: st132ep 0002 ', storadPropertyData)
            //   const featureResult = await onGetPropertyCategoryFeatureMapping(storadPropertyData?.propertyType)
            //   const mappings = featureResult?.data?.mappings ?? null

            //   setFeatureData(mappings)

            //   Object.entries(storadPropertyData)
            //     .filter(([key, value]) => key !== 'features' && (value !== '' || value !== null || value !== undefined))
            //     .forEach(([key, value]) => formik.setFieldValue(key, value))

            //   if (Array.isArray(storadPropertyData.features)) {
            //     const restoredFeatures = storadPropertyData.features.map(feature => new FeaturePayloadDTO(feature as any))
            //     formik.setFieldValue('features', restoredFeatures)
            //     setInputFeatureData(restoredFeatures)
            //   } else {
            //     formik.setFieldValue('features', [])
            //     setInputFeatureData([])
            //   }
            //   return
            // }

            // 2) If editing (propertiesId present and valueData fetched), populate with server data
            if (propertiesId && valueData) {
              console.log('Editing property with ID:', propertiesId)
              console.log('Fetched valueData:', valueData)

              // Map server data to form fields
              const serverToForm: Partial<PropertyCreationFormValues> = {
                contactName: valueData?.contact_name ?? '',
                contactNumber: valueData?.contact_phone ?? '',
                contactEmail: valueData?.contact_email ?? '',

                propertyTitle: valueData?.title ?? '',
                propertyType: valueData?.property_category_id ?? valueData?.property_category_id ?? '',
                purpose: valueData?.listing_type ?? valueData?.listing_type ?? '',
                description: valueData?.description ?? '',

                door_number: valueData?.door_number ?? '',
                street_name: valueData?.street_name ?? '',
                address_line: valueData?.address_line ?? '',
                city: valueData?.city ?? '',
                district: valueData?.district ?? '',
                state: valueData?.state ?? 'Tamil Nadu',
                postal_code: valueData?.postal_code ?? '',
                country: valueData?.country ?? 'India',
                price: valueData?.price ?? '',
                size: valueData?.property_size ?? '',
                unit: valueData?.property_size_unit ?? 'Sqft',

                latitude: valueData?.latitude ?? 0,
                longitude: valueData?.longitude ?? 0,

                option_ids: valueData?.option_ids ?? [],

                uploadType: valueData?.media && Array.isArray(valueData.media) && valueData.media.length > 0 ? 'chooseFromDevice' : '',
                propertyPhoto: [],

                localpropertyPhoto: { files: [], payload: [] },
                boostListing: false,
                uploadedFiles: [],
                features: [],
              }

              console.log('Mapped serverToForm:', serverToForm)

              Object.entries(serverToForm)
                .filter(([key]) => key !== 'features')
                .forEach(([key, value]) => formik.setFieldValue(key, value))

              // If server already has media, mark upload as completed so Next is enabled
              if (Array.isArray(valueData?.media) && valueData.media.length > 0) {
                setUploadCompleted(true)
              } else {
                setUploadCompleted(false)
              }

              // Fetch feature definitions
              if (serverToForm.propertyType) {
                const featureResult = await onGetPropertyCategoryFeatureMapping(serverToForm.propertyType as string)
                const mappings = featureResult?.data?.mappings
                setFeatureData(mappings)
                console.log('Fetched mappings:', mappings)
                const mappedFeatures = mapFeatureValuesToPayload(valueData?.feature_values, mappings ?? null)
                formik.setFieldValue('features', mappedFeatures)
                setInputFeatureData(mappedFeatures)
              } else {
                // If no propertyType, still try to map features without mappings
                const mappedFeatures = mapFeatureValuesToPayload(valueData?.feature_values, null)
                formik.setFieldValue('features', mappedFeatures)
                setInputFeatureData(mappedFeatures)
              }

              setIsEdit(true)
            }
          }
          useEffect(() => {
            init()
          }, [valueData, propertiesId])

          return (
            <Form>
              {currentStep === 1 && (
                <Step1BasicDetails
                  data={propertyCategoryData}
                  formik={formik}
                  onGetPropertyCategoryFeatureMapping={onGetPropertyCategoryFeatureMapping}
                  setFeatureData={setFeatureData}
                />
              )}
              {currentStep === 2 && <Step2LocationPrice formik={formik} />}
              {currentStep === 3 && <Step3ContactDetails formik={formik} />}
              {currentStep === 4 && (
                <Step4FeaturesAmenities
                  inputFeatureData={inputFeatureData}
                  setInputFeatureData={setInputFeatureData}
                  formik={formik}
                  amenities={featureData ?? []}
                  hasInitialFeatureValues={Boolean(valueData?.feature_values?.length)}
                />
              )}
              {currentStep === 5 && <Step5PhotosContact formik={formik} uploadPending={UPPIsPending} />}
              {currentStep === 6 && <Step6ReviewSubmit propertyCategoryData={propertyCategoryData} formik={formik} />}

              <div className="flex flex-col sm:flex-row justify-between gap-3 mt-8 pt-6 border-t border-gray-100 max-w-4xl mx-auto">
                <Button
                  type="button"
                  onClick={() => setCurrentStep(s => Math.max(s - 1, 1))}
                  disabled={currentStep === 1 || formik.isSubmitting}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg border text-gray-700 border-gray-300 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowLeft size={20} /> {localStorage.getItem(LOCAL_STORAGE_NAME?.propertyDetails) ? 'Edit' : 'Previous'}
                </Button>
                {currentStep !== 6 && (
                  <>
                    {currentStep !== 5 ? (
                      <Button
                        type="submit"
                        onClick={() => {}}
                        disabled={formik.isSubmitting || UPPIsPending}
                        className={`flex items-center gap-2 px-8 py-3 rounded-lg bg-[#7B1E1E] text-white hover:bg-[#641717] cursor-pointer focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition ${
                          formik.isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {!formik.isSubmitting ? (
                          <>
                            {isLastStep ? 'Submit' : currentStep === 4 ? 'Save Property' : 'Next Step'}
                            <ArrowRight size={20} />
                          </>
                        ) : (
                          'Loading'
                        )}
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        onClick={() => {
                          if (uploadCompleted) {
                            setCurrentStep(s => Math.min(s + 1, steps.length))
                          }
                        }}
                        disabled={!uploadCompleted}
                        className={`flex items-center gap-2 px-8 py-3 rounded-lg bg-[#7B1E1E] text-white hover:bg-[#641717] transition disabled:opacity-50 disabled:cursor-not-allowed ${
                          uploadCompleted ? 'cursor-pointer' : ''
                        }`}
                      >
                        {uploadCompleted ? 'Next Step' : 'Upload files to enable'}
                        <ArrowRight size={20} />
                      </Button>
                    )}
                  </>
                )}
              </div>
            </Form>
          )
        }}
      </Formik>
    </div>
  )
}
