'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Formik, Form } from 'formik'
import { useTranslations } from 'next-intl'
import Stats from '@/components/buyer/Stats/Stats'
import FormikTextField from '@/components/ui/Formik/FormikTextField/FormikTextField'
import { AgencyEnquirySchema } from '@/utils/validations/agency/AgencyValidationSchema'
import { Stat, Property, EnquiryFormValues } from '@/data/component/agencyDetailsTypes'
import { getMethod, postMethod } from '@/services/service'
import { appEndpoints } from '@/services/endpoints'
import { ResponseDTO } from '@/components/dto/response_dto'
import { toast } from 'react-hot-toast'
import Button from '@/components/ui/CustomComponent/Button/Button'

export default function AgencyDetails({ name }: { name: string }) {
  const t = useTranslations()
  const [agencyData, setAgencyData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchAgencyDetails = async () => {
      setIsLoading(true)
      const response: ResponseDTO = await getMethod(appEndpoints.getCompanyProfilesByName(name))

      if (response?.status === '200') {
        setAgencyData(response.data)
      }
      setIsLoading(false)
    }
    fetchAgencyDetails()
  }, [name])

  const stats: Stat[] = [
    { value: '40', label: 'properties_for_sale' },
    { value: '15', label: 'properties_for_rent' },
    { value: '2500', label: 'deals_closed' },
  ]

  const propertiesForSale: Property[] = [
    {
      id: 1,
      title: '2 BHK Flat',
      price: '₹45 Lac | 940sqft',
      location: 'Anna Nagar, Chennai',
      image: '/property1.png',
    },
    {
      id: 2,
      title: '3 BHK Flat',
      price: '₹70 Lac | 1500sqft',
      location: 'Ashok Nagar, Chennai',
      image: '/property2.png',
    },
    {
      id: 3,
      title: '2 BHK Flat',
      price: '₹50 Lac | 1000sqft',
      location: 'Vadapalani, Chennai',
      image: '/property3.png',
    },
  ]

  const propertiesForRent = [...propertiesForSale]

  const initialValues: EnquiryFormValues = {
    name: '',
    email: '',
    phone: '',
    message: '',
  }

  const handleSubmit = async (values: EnquiryFormValues, { resetForm }: any) => {
    setIsLoading(true)

    const payLoad = {
      entity_type: 'agency',
      entity_id: agencyData?.id,
      ...values,
    }

    try {
      const response = await postMethod(appEndpoints.createPropertyEnquiry, payLoad)

      if (Number(response.status) === 201) {
        toast.success('Enquiry submitted successfully!')
        resetForm()
      }
    } catch (err) {
      toast.error('Failed to submit enquiry')
    }
    setIsLoading(false)
  }

  return (
    <main className="w-full bg-gray-100 py-10 px-4 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 flex items-center gap-2">
          <Link href="/" className="text-[#3A2A20] hover:underline font-semibold">
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-500">Agency Details</span>
        </nav>

        {/* Agency Details Card */}

        <section className="bg-white shadow-lg rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row gap-8 border border-gray-200">
          {/* Agency Logo */}
          <div className="relative w-full md:w-1/3 h-56 rounded-xl overflow-hidden shadow">
            <Image src={agencyData?.companyLogo || '/agency.png'} alt="Company Logo" fill className="object-cover" />
          </div>

          {/* Agency Info */}
          <div className="flex-1 flex flex-col justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{agencyData?.contact_name}</h2>
              <p className="text-gray-600 text-sm mt-1">{agencyData?.companyName}</p>

              <p className="text-sm text-gray-600 mt-4">
                <span className="font-semibold">Operating Since:</span> 2008
              </p>

              {/* Stats Section */}
              <div className="mt-5">
                <Stats stats={stats} />
              </div>

              <p className="text-sm text-gray-700 mt-5">
                <span className="font-semibold">Deals in:</span> Rent, Lease, Pre-launch, Resale, Others
              </p>
              <p className="text-sm text-gray-700 mt-2">
                <span className="font-semibold">Operates in:</span> Kanakapura Road, RBI Layout, Doddakallasandra, Vajarahalli
              </p>
            </div>

            <Button variant="primary" className="px-6 py-3 rounded-xl text-white bg-[#3A2A20] hover:bg-[#251a14]">
              {t('PropertiesListCard.contact_agent')}
            </Button>
          </div>
        </section>

        {/* Properties for Sale */}

        <section className="bg-white shadow-md rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-6">{t('PropertiesListCard.properties_for_sale')}</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {propertiesForSale.map(item => (
              <div key={item.id} className="bg-gray-50 rounded-xl shadow hover:shadow-xl transition overflow-hidden">
                <div className="relative h-48 rounded-t-xl overflow-hidden">
                  <Image src={item.image} alt={item.title} fill className="object-cover hover:scale-105 transition" />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-gray-800">{item.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{item.price}</p>
                  <p className="text-gray-500 text-sm mt-1 mb-4">{item.location}</p>

                  <Button className="w-full bg-[#3A2A20] hover:bg-[#241810] text-white py-2 rounded-lg">{t('AgencyDetails.contact_owner')}</Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/*  Properties For Rent */}

        <section className="bg-white shadow-md rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-6">{t('PropertiesListCard.properties_for_rent')}</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {propertiesForRent.map(item => (
              <div key={item.id} className="bg-gray-50 rounded-xl shadow hover:shadow-xl transition overflow-hidden">
                <div className="relative h-48 rounded-t-xl overflow-hidden">
                  <Image src={item.image} alt={item.title} fill className="object-cover hover:scale-105 transition" />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-gray-800">{item.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{item.price}</p>
                  <p className="text-gray-500 text-sm mt-1 mb-4">{item.location}</p>

                  <Button className="w-full bg-[#3A2A20] hover:bg-[#241810] text-white py-2 rounded-lg">{t('AgencyDetails.contact_owner')}</Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

{
  /* Enquiry Form */
}
{
  /* <div className="bg-white shadow-md rounded-xl p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-bold">{t('AgencyDetails.enquire_now')}</h3>
            <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">{t('AgencyDetails.enquire_description')}</p>

            <Formik initialValues={initialValues} validationSchema={AgencyEnquirySchema(t)} onSubmit={handleSubmit}>
              {({ isSubmitting }) => (
                <Form className="space-y-3 sm:space-y-4">
                  <FormikTextField
                    label={t('form.name.label')}
                    type="text"
                    name="name"
                    placeholder={t('form.name.placeholder')}
                    className="w-full border border-gray-300 text-xs rounded-md px-3 py-2 sm:px-4 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-green-900"
                  />
                  <FormikTextField
                    label={t('form.email.label')}
                    type="email"
                    name="email"
                    placeholder={t('form.email.placeholder')}
                    className="w-full border border-gray-300 text-xs rounded-md px-3 py-2 sm:px-4 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-green-900"
                  />
                  <FormikTextField
                    label={t('form.phone_number.label')}
                    type="tel"
                    name="phone"
                    placeholder={t('form.phone_number.placeholder')}
                    className="w-full border border-gray-300 text-xs rounded-md px-3 py-2 sm:px-4 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-green-900"
                  />
                  <FormikTextField
                    label={t('form.message.label')}
                    type="textarea"
                    name="message"
                    placeholder={t('form.message.placeholder')}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-[#3A2A20] h-20 sm:h-24 resize-none text-xs"
                  />
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#3A2A20] text-white px-5 py-2 rounded-lg hover:bg-[#241810] transition disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting...' : t('Auth.submit')}
                  </Button>
                </Form>
              )}
            </Formik>
          </div> */
}
