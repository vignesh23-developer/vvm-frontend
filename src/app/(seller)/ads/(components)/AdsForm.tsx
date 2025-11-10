'use client'

import { FileText, MapPin, Phone, ArrowRight, ArrowLeft } from 'lucide-react'
import { useState, useEffect, useActionState, startTransition } from 'react'
import { Formik, Form, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

// Step components
import Step1BasicDetails from '../(views)/BasicDetails'
import Step2Location from '../(views)/Location'
import Step3Contact from '../(views)/ContactInfo'
import StepperComponent from '@/components/ui/CustomComponent/StepperComponent/StepperComponent'
import { onCreateAd, onUpdateAd } from '../(action)/ads_action'
import { AdsCreationFormValues } from '../page'

interface AdsFormProps {
  mode: 'create' | 'edit'
  initialData?: Partial<AdsCreationFormValues>
  adId?: string
}

export default function AdsForm({ mode, initialData, adId }: AdsFormProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  
  // Initialize action state
  const adActionInitState = { 
    error: false, 
    data: null, 
    message: '', 
    success: false 
  }
  
  const [adActionState, adAction, adIsPending] = useActionState<any, any>(
    mode === 'create' ? onCreateAd : onUpdateAd, 
    adActionInitState
  )

  // Handle action state changes
  useEffect(() => {
    if (adActionState?.error) {
      toast.error(adActionState?.message || `Failed to ${mode} ad`)
    }
    if (adActionState?.success) {
      toast.success(`Ad ${mode === 'create' ? 'created' : 'updated'} successfully!`)
      router.push('/ads/list')
    }
  }, [adActionState, router, mode])

  const steps = [
    { title: 'Step 1', subtitle: 'Basic Details', icon: <FileText className="w-5 h-5" /> },
    { title: 'Step 2', subtitle: 'Location', icon: <MapPin className="w-5 h-5" /> },
    { title: 'Step 3', subtitle: 'Contact', icon: <Phone className="w-5 h-5" /> },
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
    city: '',
    district: '',
    state: '',
    postal_code: '',
    country: 'USA',
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
      price: Yup.number()
        .typeError('Price must be a number')
        .positive('Price must be greater than zero')
        .required('Price is required'),
      price_unit: Yup.string().required('Price unit is required'),
    }),

    2: Yup.object().shape({
      address_line: Yup.string().trim().required('Address is required'),
      city: Yup.string().trim().required('City is required'),
      district: Yup.string().trim().required('District is required'),
      state: Yup.string().trim().required('State is required'),
      postal_code: Yup.string().trim().required('Postal code is required'),
      country: Yup.string().required('Country is required'),
    }),

    3: Yup.object().shape({
      contact_name: Yup.string().trim().required('Contact name is required'),
      contact_phone: Yup.string()
        .trim()
        .required('Contact phone is required')
        .matches(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number'),
      contact_email: Yup.string()
        .email('Invalid email address')
        .required('Contact email is required'),
    }),
  }

  const isLastStep = currentStep === steps.length

  const handleSubmit = async (
    values: AdsCreationFormValues,
    actions: FormikHelpers<AdsCreationFormValues>
  ) => {
    try {
      // Validate only the schema for the current step
      await validationSchemas[currentStep].validate(values, { abortEarly: false })

      if (isLastStep) {
        // Final submission using server action
        startTransition(async () => {
          if (mode === 'edit' && adId) {
            adAction({ id: adId, data: values })
          } else {
            adAction(values)
          }
        })
        actions.setSubmitting(false)
      } else {
        // Move to next step
        setCurrentStep(step => step + 1)
        actions.setTouched({})
        actions.setSubmitting(false)
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

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchemas[currentStep]}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {formik => (
          <Form>
            {currentStep === 1 && <Step1BasicDetails formik={formik} />}
            {currentStep === 2 && <Step2Location formik={formik} />}
            {currentStep === 3 && <Step3Contact formik={formik} />}

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row justify-between gap-3 mt-8 pt-6 border-t border-gray-200 max-w-4xl mx-auto">
              <button
                type="button"
                onClick={() => setCurrentStep(s => Math.max(s - 1, 1))}
                disabled={currentStep === 1 || formik.isSubmitting}
                className="flex items-center gap-2 px-6 py-3 rounded-lg border text-gray-700 border-gray-300 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft size={20} /> Previous
              </button>

              <button
                type="submit"
                disabled={formik.isSubmitting || adIsPending}
                className={`flex items-center gap-2 px-8 py-3 rounded-lg bg-[#7B1E1E] text-white hover:bg-[#641717] cursor-pointer focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition ${
                  formik.isSubmitting || adIsPending ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {formik.isSubmitting || adIsPending ? (
                  'Loading...'
                ) : (
                  <>
                    {isLastStep ? (mode === 'create' ? 'Submit Ad' : 'Update Ad') : 'Next Step'} <ArrowRight size={20} />
                  </>
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}
