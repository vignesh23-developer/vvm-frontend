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
import useLandRegistration, { PropertyCategoryFeatureMappingResponse } from './(hook)/land_registration_hook'
import { FeatureMappingDTO, FeaturePayloadDTO, LandRegistrationPayloadDTO } from './(dto)/land_registration_dto'

import toast from 'react-hot-toast'
import { ResponseDTO } from '@/components/dto/response_dto'
import { onAddPropertyMedia, onCreateProperty, onUpdateProperty } from './(action)/land_registration_action'
import { getLocalStorageItem, removeLocalStorageItem, setLocalStorageItem } from '@/utils/local_storage/local_storage_handler'
import { LOCAL_STORAGE_NAME } from '@/utils/local_storage/local_storage_constant'
import { useRouter } from 'next/navigation'
import { title } from 'process'
import { id } from 'zod/locales'

interface Amenity {
  id: string
  name: string
  selected: boolean
}

type PurposeType = 'Sale' | 'Rent' | 'Lease'

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
    files: Array<any>
    media_type: string
    title: string
    description: string
    media_category: string
    sort_order: string
    is_primary: boolean
  }
  boostListing: boolean
  uploadedFiles: File[] // maybe just store File[] or previews

  features: Array<FeatureMappingDTO>
  // you could also include step5 review constraints
}

interface userData {
  id: string
  firstName: string
  lastName: string
  email: string
}

export default function LandRegistrationPage() {
  const steps = [
    { title: 'Step 1', subtitle: 'Basic Details', icon: <Home className="w-5 h-5" /> },
    { title: 'Step 2', subtitle: 'Location & Price', icon: <MapPin className="w-5 h-5" /> },
    { title: 'Step 3', subtitle: 'Contact Details', icon: <ContactRound className="w-5 h-5" /> },
    { title: 'Step 4', subtitle: 'Features & Amenities', icon: <Star className="w-5 h-5" /> },
    { title: 'Step 5', subtitle: 'Photos', icon: <Camera className="w-5 h-5" /> },
    { title: 'Step 6', subtitle: 'Review & Submit', icon: <Check className="w-5 h-5" /> },
  ]

  const predefinedAmenities = [
    'Parking',
    'Garden',
    'Swimming Pool',
    'Gym',
    'Security',
    'Elevator',
    'Power Backup',
    'Water Supply',
    'Internet',
    'Club House',
    'Children Play Area',
    'Jogging Track',
    'CCTV',
    'Intercom',
    'Maintenance Staff',
    'Waste Management',
  ]

  const [amenities, setAmenities] = useState<Amenity[]>(
    predefinedAmenities.map((name, i) => ({
      id: `amenity-${i}`,
      name,
      selected: false,
    })),
  )

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
      }
      setUserValue(user)
    }
  }, [])

  const [currentStep, setCurrentStep] = useState(1)
  const [featureData, setFeatureData] = useState<Array<FeatureMappingDTO> | null>(null)
  const [inputFeatureData, setInputFeatureData] = useState<Array<FeaturePayloadDTO> | null>(null)

  const [isEdit, setIsEdit] = useState<boolean>(false)

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
      media_type: '',
      title: '',
      description: '',
      media_category: '',
      sort_order: '',
      is_primary: false,
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

                  console.log('dsdsd', originalValue)

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
            media_type: Yup.string().required('Media type is required'),
            title: Yup.string().optional(),
            description: Yup.string().optional(),
            media_category: Yup.string().optional(),
            sort_order: Yup.string().optional(),
            is_primary: Yup.boolean().default(false).required('Is primary is required'),
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
      setCurrentStep(step => step + 1)
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
          setLocalStorageItem(LOCAL_STORAGE_NAME?.propertyDetails, JSON.stringify(values))
        } else if (currentStep === 2) {
          setLocalStorageItem(LOCAL_STORAGE_NAME?.propertyDetails, JSON.stringify(values))
        } else if (currentStep === 3) {
          setLocalStorageItem(LOCAL_STORAGE_NAME?.propertyDetails, JSON.stringify(values))
        } else if (currentStep === 4) {
          setLocalStorageItem(LOCAL_STORAGE_NAME?.propertyDetails, JSON.stringify(values))
        }

        if (currentStep === 4 && featureData) {
          // Extract all mandatory feature category IDs
          const mandatoryFeatures = featureData.filter(val => val.is_mandatory)
          const mandatoryIds = mandatoryFeatures.map(f => f.feature_category_id)

          // Find which mandatory features are filled by user
          const filledMandatory = mandatoryIds.filter(id => {
            const feature = (inputFeatureData ?? []).find(f => f.feature_category_id === id)
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
            agent_id: userValue?.id || '',
            // Ensure each feature is an instance of FeaturePayloadDTO so `toObject()` exists at runtime.
            features: (inputFeatureData ?? []).map(f => (f instanceof FeaturePayloadDTO ? f : new FeaturePayloadDTO(f as any))),
          })

          var payload = LandRegistrationData?.toObject()

          const localStroagePropertyId = await getLocalStorageItem(LOCAL_STORAGE_NAME?.propertyId)

          console.log('log on data sss:', localStroagePropertyId, payload)

          if (localStroagePropertyId) {
            startTransition(async () => {
              ULRAction({ payload, localStroagePropertyId })
            })
          } else {
            startTransition(async () => {
              LRAction({ payload, userId: userValue?.id })
            })
          }
          return
        }

        if (currentStep === 5) {
          const propertyId = getLocalStorageItem(LOCAL_STORAGE_NAME?.propertyId)
          console.log(
            'photo payload',
            propertyId,
            values?.uploadType === 'addViaLink'
              ? values?.propertyPhoto.map(val => {
                  val?.media_type, val?.title, val?.url
                })
              : values?.localpropertyPhoto,
            values?.uploadType,
          )

          const localstoradImgData = values?.localpropertyPhoto
          var formData = new FormData()

          formData?.append('files', JSON.stringify(localstoradImgData?.files))

          if (localstoradImgData?.media_type) {
            formData?.append('media_type', JSON.stringify(localstoradImgData?.media_type))
          }

          if (localstoradImgData?.title) {
            formData?.append('title', JSON.stringify(localstoradImgData?.title))
          }

          if (localstoradImgData?.description) {
            formData?.append('description', JSON.stringify(localstoradImgData?.description))
          }

          if (localstoradImgData?.is_primary) {
            formData?.append('is_primary', JSON.stringify(localstoradImgData?.is_primary))
          }

          if (localstoradImgData?.media_category) {
            formData?.append('media_category', JSON.stringify(localstoradImgData?.media_category))
          }

          if (localstoradImgData?.sort_order) {
            formData?.append('sort_order', JSON.stringify(localstoradImgData?.sort_order))
          }

          formData?.append('files', JSON.stringify(values?.localpropertyPhoto?.files))

          const payload =
            values.uploadType === 'addViaLink'
              ? values.propertyPhoto // already an array?
              : formData

          startTransition(async () => {
            UPPAction({
              id: propertyId ?? '',
              payload: values.uploadType === 'addViaLink' ? (Array.isArray(payload) ? payload : [payload]) : payload,
              uploadType: values?.uploadType as any,
            })
          })

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

  const router = useRouter()

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
            const localStoradData: any = await getLocalStorageItem(LOCAL_STORAGE_NAME.propertyDetails)

            console.log('localstorade val:', localStoradData)

            if (localStoradData) {
              const storadPropertyData: PropertyCreationFormValues = JSON.parse(localStoradData)
              console.log('localstorade val: st132ep 0002 ', storadPropertyData)
              const featureResult = await onGetPropertyCategoryFeatureMapping(storadPropertyData?.propertyType)

              setFeatureData(featureResult?.data?.mappings)

              Object.entries(storadPropertyData)
                .filter(([key, value]) => value !== '' || value !== null || value !== undefined)
                .forEach(([key, value]) => formik.setFieldValue(key, value))
            }
          }
          useEffect(() => {
            init()
          }, [])

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
                />
              )}
              {currentStep === 5 && <Step5PhotosContact formik={formik} />}
              {currentStep === 6 && <Step6ReviewSubmit propertyCategoryData={propertyCategoryData} formik={formik} />}

              {currentStep !== 6 && (
                <div className="flex flex-col sm:flex-row justify-between gap-3 mt-8 pt-6 border-t border-gray-100 max-w-4xl mx-auto">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(s => Math.max(s - 1, 1))}
                    disabled={currentStep === 1 || formik.isSubmitting}
                    className="flex items-center gap-2 px-6 py-3 rounded-lg border text-gray-700 border-gray-300 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowLeft size={20} /> {localStorage.getItem(LOCAL_STORAGE_NAME?.propertyId) ? 'Edit' : 'Previous'}
                  </button>

                  {localStorage.getItem(LOCAL_STORAGE_NAME?.propertyDetails) && (
                    <button
                      type="button"
                      onClick={() => {
                        removeLocalStorageItem(LOCAL_STORAGE_NAME.propertyDetails)
                        removeLocalStorageItem(LOCAL_STORAGE_NAME.propertyId)
                        formik?.setValues(initialValues)
                        setCurrentStep(1)
                        router?.push('/land-registration')
                      }}
                      className="flex items-center gap-2 px-6 py-3 rounded-lg border text-gray-700 border-gray-300 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Unsave
                    </button>
                  )}

                  <button
                    type="submit"
                    disabled={formik.isSubmitting}
                    className={`flex items-center gap-2 px-8 py-3 rounded-lg bg-[#7B1E1E] text-white hover:bg-[#641717] cursor-pointer focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition ${
                      formik.isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {' '}
                    {!formik.isSubmitting ? (
                      <>
                        {isLastStep ? 'Submit' : currentStep === 4 ? 'Save Property' : 'Next Step'} <ArrowRight size={20} />
                      </>
                    ) : (
                      'Loading'
                    )}
                  </button>
                </div>
              )}
            </Form>
          )
        }}
      </Formik>
    </div>
  )
}
