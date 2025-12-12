'use client'

import { motion } from 'framer-motion'
import { Home, Shield, TrendingUp, Users } from 'lucide-react'
import { Formik, Form } from 'formik'
import { toast } from 'react-hot-toast'
import Button from '@/components/ui/CustomComponent/Button/Button'
import FormikTextField from '@/components/ui/Formik/FormikTextField/FormikTextField'
import EnquiryFormValidation from './EnquiryFormValidation'
import { postMethod } from '@/services/service'
import { appEndpoints } from '@/services/endpoints'
import { ResponseDTO } from '@/components/dto/response_dto'

interface EnquiryFormModalProps {
  Id: string | number
  entityType?: string
  handleSubmit: (values: any, formikHelpers: any) => Promise<void>
  defaultValues?: Partial<EnquiryFormValues>
}

interface EnquiryFormValues {
  entity_type: string
  entity_id?: string | number | null
  name: string
  email: string
  phone: string
  message: string
}

const EnquiryFormCard = ({ Id, entityType, handleSubmit, defaultValues }: EnquiryFormModalProps & { defaultValues?: Partial<EnquiryFormValues> }) => {
  const initialValues: EnquiryFormValues = {
    entity_type: entityType || '',
    entity_id: Id ? Id : null,
    name: defaultValues?.name || '',
    email: defaultValues?.email || '',
    phone: defaultValues?.phone || '',
    message: '',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className="bg-gradient-to-br from-yellow-50 to-yellow-100/30 rounded-xl border border-yellow-200 p-6 shadow-sm"
    >
      <div className="text-center mb-6">
        <motion.div
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#2a1407] mb-4"
        >
          <Users size={24} className="text-white" />
        </motion.div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Have an Enquiry?</h3>
        <p className="text-sm text-gray-600">Share your requirement — we’re here to assist you.</p>
      </div>

      <ul className="space-y-3 mb-6">
        {[
          { icon: Home, text: 'Get quick answers for any property-related enquiries' },
          { icon: TrendingUp, text: 'Receive expert guidance tailored to your needs' },
          { icon: Shield, text: 'Verified information for safe and clear decision-making' },
        ].map((item, idx) => {
          const Icon = item.icon
          return (
            <motion.li
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-start gap-3 text-sm text-gray-700"
            >
              <Icon size={18} className="text-yellow-600 mt-0.5 flex-shrink-0" />
              <span>{item.text}</span>
            </motion.li>
          )
        })}
      </ul>

      <div className="space-y-3">
        <Formik initialValues={initialValues} validationSchema={EnquiryFormValidation} onSubmit={handleSubmit}>
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              {/* Name */}
              <div>
                <FormikTextField
                  type="text"
                  label="Name"
                  name="name"
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 rounded-lg border border-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-400 transition-all bg-white"
                />
              </div>

              {/* email */}
              <div>
                <FormikTextField
                  type="email"
                  label="Email"
                  name="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-lg border border-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-400 transition-all bg-white"
                />
              </div>

              {/* phone */}
              <div>
                <FormikTextField
                  type="tel"
                  label="Mobile Number"
                  name="phone"
                  placeholder="Enter your mobile number"
                  className="w-full px-4 py-3 rounded-lg border border-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-400 transition-all bg-white"
                />
              </div>

              {/* Message */}
              <div>
                <FormikTextField
                  label="Message"
                  as="textarea"
                  name="message"
                  placeholder="Enter your message..."
                  className="w-full px-4 py-3 rounded-lg border border-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-400 transition-all bg-white"
                />
              </div>

              {/* Buttons */}
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  onClick={() => {}}
                  className="w-full bg-[#2a1407] text-white px-4 py-2 rounded-md hover:bg-[#2a1407] disabled:opacity-50"
                >
                  {isSubmitting ? 'Connecting...' : 'Connect'}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </motion.div>
  )
}

export default EnquiryFormCard
