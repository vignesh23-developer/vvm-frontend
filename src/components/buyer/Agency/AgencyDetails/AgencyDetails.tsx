'use client'

import Link from 'next/link'
import Stats from '../../../../components/buyer/Stats/Stats'
import Image from 'next/image'
import FormikTextField from '@/components/ui/Formik/FormikTextField/FormikTextField'
import { Formik, Form } from 'formik'
import { AgencyEnquirySchema } from '@/utils/validations/agency/AgencyValidationSchema'
import { useTranslations } from 'next-intl'

export default function AgencyDetails() {
  const t = useTranslations()
  const stats = [
    { value: '40', label: 'properties_for_sale' },
    { value: '15', label: 'properties_for_rent' },
    { value: '2500', label: 'deals_closed' },
  ]
  const propertiesForSale = [
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

  const propertiesForRent = [...propertiesForSale] // demo re-use

  return (
    <main className="w-full bg-gray-50 py-8 px-4 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto space-y-10 sm:space-y-12">
        {/* 🔹 Breadcrumb */}
        <nav className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6 flex flex-wrap items-center gap-1 sm:gap-2">
          <Link href="/home" className="text-[#3A2A20] hover:underline">
            Home
          </Link>
          <span>›</span>
          <span className="text-gray-500">Agency</span>
        </nav>

        {/* 🔹 Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Agent Card */}
          <div className="lg:col-span-2 bg-white shadow-md rounded-xl p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6">
            {/* Left Image */}
            <div className="relative w-full sm:w-1/3 aspect-square sm:aspect-auto sm:h-auto rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src="/agency.png"
                alt="Agent Deal"
                fill
                className="object-cover"
              />
            </div>

            {/* Right Details */}
            <div className="flex-1">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">
                Shankar
              </h2>
              <p className="text-sm text-gray-600">RMS Realtors</p>
              <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
                <span className="font-semibold">
                  {t('PropertiesListCard.operating_since')}:
                </span>{' '}
                2008
              </p>

              {/* Stats */}
              <Stats stats={stats} />

              {/* Info */}
              <p className="text-xs sm:text-sm text-gray-700 mt-4 mb-2">
                <span className="font-semibold">Deals in:</span> Rent/Lease,
                Pre-launch, Original Booking, Resale, Others
              </p>
              <p className="text-xs sm:text-sm text-gray-700 mb-4 sm:mb-6">
                <span className="font-semibold">Operates in:</span> Kanakapura
                Road, RBI Layout, Doddakallasandra, Vajarahalli, Block 8th,
                Anjanapura, Block 4in Road
              </p>

              {/* Contact Button */}
              <button className="w-full sm:w-auto bg-[#3A2A20] text-white px-5 py-2 rounded-lg hover:bg-[#241810] transition">
                {t('PropertiesListCard.contact_agent')}
              </button>
            </div>
          </div>

          {/* Enquiry Form */}
          <div className="bg-white shadow-md rounded-xl p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-bold">
              {t('AgencyDetails.enquire_now')}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
              {t('AgencyDetails.enquire_description')}
            </p>

            <Formik
              initialValues={{ name: '', email: '', phone: '', message: '' }}
              validationSchema={AgencyEnquirySchema(t)}
              onSubmit={(values, { resetForm }) => {
                console.log('Form Data:', values)
                resetForm()
              }}
            >
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
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#3A2A20] text-white px-5 py-2 rounded-lg hover:bg-[#241810] transition disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting...' : t('Auth.submit')}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>

        {/* Properties For Sale */}
        <section className="bg-white shadow-md rounded-xl p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">
            {t('PropertiesListCard.properties_for_sale')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {propertiesForSale.map(property => (
              <div
                key={property.id}
                className="bg-gray-50 rounded-lg shadow hover:shadow-lg transition overflow-hidden"
              >
                <div className="relative w-full h-40 sm:h-48 lg:h-56">
                  <Image
                    src={property.image}
                    alt={property.title}
                    fill
                    className="object-cover hover:scale-105 transition"
                  />
                </div>
                <div className="p-3 sm:p-4">
                  <h3 className="font-semibold text-sm sm:text-base">
                    {property.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {property.price}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">
                    {property.location}
                  </p>
                  <button className="w-full sm:w-auto bg-[#3A2A20] text-white px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg hover:bg-[#241810] transition">
                    {t('AgencyDetails.contact_owner')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Properties For Rent */}
        <section className="bg-white shadow-md rounded-xl p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">
            {t('PropertiesListCard.properties_for_rent')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {propertiesForRent.map(property => (
              <div
                key={property.id}
                className="bg-gray-50 rounded-lg shadow hover:shadow-lg transition overflow-hidden"
              >
                <div className="relative w-full h-40 sm:h-48 lg:h-56">
                  <Image
                    src={property.image}
                    alt={property.title}
                    fill
                    className="object-cover hover:scale-105 transition"
                  />
                </div>
                <div className="p-3 sm:p-4">
                  <h3 className="font-semibold text-sm sm:text-base">
                    {property.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {property.price}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">
                    {property.location}
                  </p>
                  <button className="w-full sm:w-auto bg-[#3A2A20] text-white px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg hover:bg-[#241810] transition">
                    {t('AgencyDetails.contact_owner')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
