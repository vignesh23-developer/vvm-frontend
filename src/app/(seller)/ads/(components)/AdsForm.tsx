'use client'

import { FileText, MapPin, Phone, ArrowRight, ArrowLeft, Upload } from 'lucide-react'
import { useState, useEffect, useActionState, startTransition } from 'react'
import { Formik, Form, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import { usePathname, useRouter } from 'next/navigation'

// Step components
import Step1BasicDetails from '../(views)/BasicDetails'
import Step2Location from '../(views)/Location'
import Step3Contact from '../(views)/ContactInfo'
import StepperComponent from '@/components/ui/CustomComponent/StepperComponent/StepperComponent'
import AdsImages from '../(views)/Images'
import { onCreateAd, onUpdateAd } from '../(action)/ads_action'
import { AdsCreationFormValues } from '../page'
import { useKycStatus } from '@/components/kyc/hooks/useKycStatus'
import { useAuth } from '@/hooks/AuthContext/AuthContextProvider'
import { getUserRoles, hasRole, Roles } from '@/utils/roles/roles'

interface AdsFormProps {
  mode: 'create' | 'edit'
  initialData?: Partial<AdsCreationFormValues>
  adId?: string
}

export default function AdsForm({ mode, initialData, adId }: AdsFormProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, token, loading: authLoading } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [createdAdId, setCreatedAdId] = useState<string | undefined>(adId)

  // Admin-only guard (client-side fallback; middleware enforces on initial request)
  useEffect(() => {
    // if (authLoading) return

    // if (!token) {
    //   const next = pathname ? `?next=${encodeURIComponent(pathname)}` : ''
    //   router.replace(`/login${next}`)
    //   return
    // }

    const userRoles = getUserRoles(user)
    const isAdmin = hasRole(userRoles, [Roles.ADMIN])
    if (!isAdmin) {
      router.replace('/')
    }
  }, [authLoading, pathname, router, token, user])

  // Initialize action state
  const adActionInitState = {
    error: false,
    data: null,
    message: '',
    success: false,
  }

  // Define the action return type
  type AdActionReturn = Promise<{
    success: boolean
    error: boolean
    message: string
    data: any
  }>

  const [adActionState, adAction, adIsPending] = useActionState<any, any>(
    (mode === 'create' ? onCreateAd : onUpdateAd) as (prevState: any, payload: any) => AdActionReturn,
    adActionInitState,
  )

  // KYC Verification Hook
  const { kycStatus, loading: isKycLoading, error: kycError, refetch } = useKycStatus()

  useEffect(() => {
    if (isKycLoading || kycError) return

    // Block ad creation/edit until KYC is verified
    if (kycStatus?.isVerified === false) {
      toast('Please complete KYC verification to create your ads', {
        icon: '⚠️',
        style: { borderRadius: '8px', background: '#fff3cd', color: '#856404' },
      })
      router.replace('/kyc-pending')
    }
  }, [isKycLoading, kycError, kycStatus?.isVerified, router])

  // Handle action state changes
  useEffect(() => {
    if (adActionState?.error) {
      toast.error(adActionState?.message || `Failed to ${mode} ad`)
    }
    if (adActionState?.success) {
      if (mode === 'create') {
        const newId = (adActionState?.data as any)?.id ?? (adActionState?.data as any)?.data?.id
        if (newId) setCreatedAdId(newId)
        setCurrentStep(4)
        toast.success('Ad created. Now upload images.')
      } else {
        toast.success('Ad updated successfully!')
        // remain on the form; user can navigate to images step if needed
      }
    }
  }, [adActionState, mode])

  const steps = [
    { title: 'Step 1', subtitle: 'Basic Details', icon: <FileText className="w-5 h-5" /> },
    { title: 'Step 2', subtitle: 'Location', icon: <MapPin className="w-5 h-5" /> },
    { title: 'Step 3', subtitle: 'Contact', icon: <Phone className="w-5 h-5" /> },
    { title: 'Step 4', subtitle: 'Images', icon: <Upload className="w-5 h-5" /> },
  ]

  const defaultValues: AdsCreationFormValues = {
    title: '',
    description: '',
    category_id: '',
    price: '',
    price_unit: 'USD',
    is_negotiable: false,
    status: 'AVAILABLE',
    is_published: false,
    is_boosted: false,

    address_line: '',
    door_number: '',
    street_name: '',
    city: '',
    district: '',
    state: 'Tamil Nadu',
    postal_code: '',
    country: 'India',
    latitude: 0,
    longitude: 0,

    contact_name: '',
    contact_phone: '',
    contact_email: '',
  }

  const initialValues: AdsCreationFormValues = {
    ...defaultValues,
    ...initialData,
  }

  // Validation schemas per step
  const validationSchemas: { [key: number]: Yup.ObjectSchema<any> } = {
    1: Yup.object().shape({
      title: Yup.string().trim().required('Title is required'),
      description: Yup.string().trim().required('Description is required'),
      category_id: Yup.string().required('Category is required'),
      price: Yup.number().typeError('Price must be a number').positive('Price must be greater than zero').required('Price is required'),
      price_unit: Yup.string().required('Price unit is required'),
    }),

    2: Yup.object().shape({
      address_line: Yup.string().trim().required('Address is required'),
      door_number: Yup.string().trim().optional().notRequired(),
      street_name: Yup.string().trim().optional().notRequired(),
      city: Yup.string().trim().optional().notRequired(),
      district: Yup.string().trim().optional().notRequired(),
      state: Yup.string().oneOf(['Tamil Nadu'], 'State must be Tamil Nadu'),
      postal_code: Yup.string().trim().optional().notRequired(),
      country: Yup.string().oneOf(['India'], 'Country must be India'),
    }),

    3: Yup.object().shape({
      contact_name: Yup.string().trim().required('Contact name is required'),
      contact_phone: Yup.string()
        .trim()
        .required('Contact phone is required')
        .matches(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number'),
      contact_email: Yup.string().email('Invalid email address').required('Contact email is required'),
    }),
  }

  const isLastStep = currentStep === 3 // the Formik-controlled steps end at 3; step 4 is a separate upload flow

  const handleSubmit = async (values: AdsCreationFormValues, actions: FormikHelpers<AdsCreationFormValues>) => {
    try {
      // Validate only the schema for the current step
      await validationSchemas[currentStep].validate(values, { abortEarly: false })

      if (isLastStep) {
        // Final submission using server action
        try {
          if (mode === 'edit' && adId) {
            const result = await onUpdateAd({}, { id: adId, data: values })
            if (!result.error) {
              setCurrentStep(4)
              toast.success('Ad updated. Now you can update images.')
              return
            }
          } else {
            const result = await onCreateAd({}, values)
            if (!result.error) {
              const newAdId = result.data?.id || result.data?.data?.id
              if (newAdId) {
                setCreatedAdId(newAdId)
                setCurrentStep(4)
                toast.success('Ad created successfully! Now upload images.')
                return
              }
            } else {
              throw new Error(result.message || 'Failed to create ad')
            }
          }
        } catch (error: any) {
          console.error('Error creating/updating ad:', error)
          toast.error(error?.message || 'Failed to save ad. Please try again.')
          actions.setSubmitting(false)
          return
        }
      } else {
        // Move to next step
        setCurrentStep(step => step + 1)
        actions.setTouched({})
      }
    } catch (err) {
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
    <div className="w-full px-4 py-6 min-h-screen bg-gray-50">
      {/* Progress Stepper */}
      <div className="mb-8">
        <StepperComponent
          steps={steps}
          currentStep={currentStep}
          topText={mode === 'create' ? 'Create your ad and reach potential buyers' : 'Update your ad details'}
        />
      </div>

      <Formik initialValues={initialValues} validationSchema={validationSchemas[currentStep]} onSubmit={handleSubmit} enableReinitialize>
        {formik => (
          <Form>
            <div className={`max-w-4xl mx-auto ${currentStep === 4 ? 'max-w-3xl' : ''}`}>
              {currentStep === 1 && <Step1BasicDetails formik={formik} />}
              {currentStep === 2 && <Step2Location formik={formik} />}
              {currentStep === 3 && <Step3Contact formik={formik} />}
              {currentStep === 4 && <AdsImages adId={createdAdId || adId || ''} onUploaded={() => router.push('/ads/list')} mode={mode} />}
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row justify-between gap-3 mt-8 pt-6 border-t border-gray-200 max-w-4xl mx-auto">
              {currentStep !== 4 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(s => Math.max(s - 1, 1))}
                  disabled={currentStep === 1 || formik.isSubmitting}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg border text-gray-700 border-gray-300 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowLeft size={20} /> Previous
                </button>
              )}
              <div className={currentStep === 4 ? 'w-full' : ''}>
                {currentStep <= 3 && (
                  <button
                    type="submit"
                    disabled={formik.isSubmitting || adIsPending}
                    className={`flex items-center gap-2 px-8 py-3 rounded-lg bg-[#2a1407] text-white hover:bg-[#641717] cursor-pointer focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition ${
                      formik.isSubmitting || adIsPending ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {formik.isSubmitting || adIsPending ? (
                      'Loading...'
                    ) : (
                      <>
                        {isLastStep ? (mode === 'create' ? 'Create Ad & Continue' : 'Update Ad') : 'Next Step'} <ArrowRight size={20} />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}
