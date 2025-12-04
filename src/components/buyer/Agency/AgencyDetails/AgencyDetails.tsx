'use client'

import { useEffect, useMemo, useState, type ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Formik, Form } from 'formik'
import { useTranslations } from 'next-intl'
import FormikTextField from '@/components/ui/Formik/FormikTextField/FormikTextField'
import { AgencyEnquirySchema } from '@/utils/validations/agency/AgencyValidationSchema'
import AgentCompanyProfile from '@/components/buyer/PropertiesListing/dto/agentCompanyProfile'
import { EnquiryFormValues } from '@/data/component/agencyDetailsTypes'
import { getMethod, postMethod } from '@/services/service'
import { appEndpoints } from '@/services/endpoints'
import { ResponseDTO } from '@/components/dto/response_dto'
import { toast } from 'react-hot-toast'
import Button from '@/components/ui/CustomComponent/Button/Button'
import CustumLoader from '@/components/ui/CustomComponent/Loader/CustomLoader'
import { Loader2, CalendarDays, Building2, Handshake, MapPin, Mail, Phone, ShieldCheck, CircleUserRound } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface InfoItemProps {
  label: string
  value: string
  icon?: ReactNode
  href?: string
}

function InfoItem({ label, value, icon, href }: InfoItemProps) {
  const content = (
    <div className="flex items-start gap-3 rounded-2xl bg-stone-50/70 px-4 py-3">
      {icon ? <span className="mt-1 text-amber-600">{icon}</span> : null}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">{label}</p>
        <p className="mt-1 text-sm font-medium text-stone-800">{value}</p>
      </div>
    </div>
  )

  if (href) {
    return (
      <a href={href} className="block transition hover:text-amber-600">
        {content}
      </a>
    )
  }

  return content
}

const dummyProperties = [
  {
    id: 1,
    name: 'Green Villa',
    images: ['/about1.png', '/about2.png', '/about3.png', '/about1.png', '/about2.png'],
  },
  {
    id: 2,
    name: 'Sunset Apartment',
    images: ['/about2.png', '/about1.png'],
  },
  {
    id: 3,
    name: 'Ocean View Home',
    images: ['/about3.png', '/about1.png', '/about3.png'],
  },
  {
    id: 4,
    name: 'View Home',
    images: ['/about3.png', '/about2.png', '/about1.png'],
  },
  {
    id: 5,
    name: 'Home',
    images: ['/about3.png', '/about1.png'],
  },
]

export default function AgencyDetails({ name }: { name: string }) {
  const t = useTranslations()
  const [selectedProperty, setSelectedProperty] = useState<any>(dummyProperties[0] ?? null)
  const [agencyData, setAgencyData] = useState<AgentCompanyProfile | null>(null)
  const [isFetching, setIsFetching] = useState<boolean>(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchAgencyDetails = async () => {
      setIsFetching(true)
      setFetchError(null)

      try {
        const response: ResponseDTO = await getMethod(appEndpoints.getCompanyProfilesByName(name))

        if (!isMounted) return

        if (response?.status === '200') {
          const payload = Array.isArray(response?.data) ? (response.data as AgentCompanyProfile[])[0] : (response?.data as AgentCompanyProfile | null)
          setAgencyData(payload ?? null)

          if (!payload) {
            setFetchError(t('AgencyDetails.no_results'))
          }
        } else {
          setAgencyData(null)
          setFetchError(response?.message || t('AgencyDetails.fetch_error'))
        }
      } catch (error: any) {
        if (!isMounted) return
        setAgencyData(null)
        const message = error?.message || t('AgencyDetails.fetch_error')
        setFetchError(message)
        toast.error(message)
      } finally {
        if (isMounted) {
          setIsFetching(false)
        }
      }
    }

    void fetchAgencyDetails()

    return () => {
      isMounted = false
    }
  }, [name, t])

  const establishedYear = useMemo(() => {
    if (!agencyData?.createdAt) return '—'
    const year = new Date(agencyData.createdAt).getFullYear()
    return Number.isNaN(year) ? '—' : String(year)
  }, [agencyData?.createdAt])

  const highlightStats = useMemo(
    () => [
      { labelKey: 'PropertiesListCard.operating_since', value: establishedYear, Icon: CalendarDays },
      { labelKey: 'PropertiesListCard.properties_for_sale', value: '—', Icon: Building2 },
      { labelKey: 'PropertiesListCard.deals_closed', value: '—', Icon: Handshake },
    ],
    [establishedYear],
  )

  const fullAddress = useMemo(() => {
    const parts = [
      agencyData?.address_line,
      agencyData?.city,
      agencyData?.district,
      agencyData?.state,
      agencyData?.postal_code,
      agencyData?.country,
    ].filter(Boolean)

    return parts.length ? parts.join(', ') : ''
  }, [agencyData?.address_line, agencyData?.city, agencyData?.district, agencyData?.state, agencyData?.postal_code, agencyData?.country])

  const serviceRegions = useMemo(() => {
    const regions = [agencyData?.district, agencyData?.state, agencyData?.country].filter(Boolean)
    return regions.length ? regions.join(', ') : '—'
  }, [agencyData?.district, agencyData?.state, agencyData?.country])

  const contactPhone = agencyData?.contact_phone || agencyData?.user?.phoneNumber || ''
  const contactEmail = agencyData?.contact_email || agencyData?.user?.email || ''
  const profileTitle = agencyData?.profileName || agencyData?.companyName || name
  const contactName = agencyData?.contact_name || agencyData?.user?.firstName || ''
  const companyLogo = agencyData?.companyLogo || '/agency.png'
  const isVerified = Boolean(agencyData?.isVerified)

  const handleSubmit = async (values: EnquiryFormValues, { resetForm, setSubmitting }: any) => {
    const payload = {
      entity_type: 'agency',
      entity_id: agencyData?.id,
      ...values,
    }

    try {
      const response = await postMethod(appEndpoints.createPropertyEnquiry, payload)

      if (Number(response.status) === 201) {
        toast.success('Enquiry submitted successfully!')
        resetForm()
      } else {
        toast.error(response?.message || 'Failed to submit enquiry')
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to submit enquiry')
    } finally {
      setSubmitting(false)
    }
  }

  console.log('fetcherror', fetchError)

  return (
    <main className="min-h-screen bg-gradient-to-br from-stone-100 via-white to-stone-50 py-10 px-4 sm:px-6 lg:px-0">
      <div className="mx-auto w-full max-w-6xl space-y-10">
        <nav className="flex items-center gap-2 text-sm text-stone-500">
          <Link href="/" className="font-medium text-stone-700 transition hover:text-amber-600">
            {t('Navbar.home')}
          </Link>
          <span>/</span>
          <span className="text-stone-400">{t('Navbar.subMenus.agency_details')}</span>
        </nav>

        {isFetching ? (
          <CustumLoader text="Loading agency details..." />
        ) : (
          <div className="space-y-10">
            <section className="overflow-hidden rounded-3xl border border-stone-200 bg-white/80 shadow-sm backdrop-blur">
              <div className="flex flex-col gap-8 px-6 py-8 sm:px-10 md:flex-row md:py-10">
                <div className="mx-auto w-full max-w-xs md:mx-0 md:w-64">
                  <div className="relative aspect-square overflow-hidden rounded-2xl border border-stone-200 bg-stone-100">
                    <Image src={companyLogo} alt={`${profileTitle} logo`} fill className="object-cover" sizes="256px" priority />
                  </div>

                  {isVerified && (
                    <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                      <ShieldCheck size={14} /> {t('AgencyDetails.verified')}
                    </span>
                  )}
                </div>

                <div className="flex-1 space-y-6">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wide text-amber-700">
                      <span className="rounded-full bg-amber-100/80 px-3 py-1 text-amber-700">{t('PropertiesListCard.agent')}</span>
                      {!isVerified && <span className="rounded-full bg-stone-200 px-3 py-1 text-stone-600">{t('AgencyDetails.not_verified')}</span>}
                    </div>

                    <h1 className="text-3xl font-bold text-stone-900 sm:text-4xl">{profileTitle}</h1>
                    {agencyData?.shortTitle && <p className="text-base text-stone-600">{agencyData.shortTitle}</p>}
                    {agencyData?.description && <p className="text-sm leading-relaxed text-stone-600">{agencyData.description}</p>}
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {highlightStats.map(stat => (
                      <div key={stat.labelKey} className="flex gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-5 shadow-sm">
                        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                          <stat.Icon size={22} />
                        </span>
                        <div>
                          <p className="text-2xl font-semibold text-stone-900">{stat.value}</p>
                          <p className="whitespace-pre-line text-xs font-medium uppercase tracking-wide text-stone-500">{t(stat.labelKey)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 border-t border-stone-200 bg-stone-50/80 px-6 py-5 sm:px-10 sm:py-6 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-stone-600">
                  {contactName && (
                    <span className="inline-flex items-center gap-2 font-medium text-stone-800">
                      <CircleUserRound size={16} /> {contactName}
                    </span>
                  )}
                  {contactPhone && (
                    <a
                      href={`tel:${contactPhone}`}
                      className="inline-flex items-center gap-2 font-medium text-stone-800 transition hover:text-amber-600"
                    >
                      <Phone size={16} /> {contactPhone}
                    </a>
                  )}
                  {contactEmail && (
                    <a
                      href={`mailto:${contactEmail}`}
                      className="inline-flex items-center gap-2 font-medium text-stone-800 transition hover:text-amber-600"
                    >
                      <Mail size={16} /> {contactEmail}
                    </a>
                  )}
                  {fullAddress && (
                    <span className="inline-flex items-center gap-2">
                      <MapPin size={16} /> {fullAddress}
                    </span>
                  )}
                </div>

                {contactPhone && (
                  <Button
                    onClick={() => window.open(`tel:${contactPhone}`)}
                    className="flex items-center gap-2 rounded-full bg-amber-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-amber-700"
                  >
                    <Phone size={16} /> {t('AgencyDetails.contact_owner')}
                  </Button>
                )}
              </div>
            </section>

            <section className="w-full flex flex-col items-center py-2">
              {/* Properties grid (centered) */}
              <div className="w-full max-w-4xl">
                <h2 className="mb-4 text-center text-lg font-semibold tracking-wide text-stone-900">Properties by this agency</h2>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  {dummyProperties.map(p => {
                    const isActive = selectedProperty?.id === p.id
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelectedProperty(p)}
                        className={`rounded-full border px-4 py-2 text-xs font-semibold transition focus:outline-none focus:ring-2 focus:ring-amber-300 ${
                          isActive
                            ? 'border-amber-400 bg-amber-50 text-amber-800 shadow-sm'
                            : 'border-stone-200 bg-white text-stone-700 hover:border-amber-200 hover:text-amber-700'
                        }`}
                      >
                        {p.name}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Inline gallery viewer with animation */}
              <AnimatePresence initial={false} mode="wait">
                {selectedProperty && (
                  <motion.div
                    key={selectedProperty.id}
                    initial={{ opacity: 0, y: 25, scale: 0.96, filter: 'blur(0px)' }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: 20, scale: 0.96, filter: 'blur(0px)' }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="
        mt-8 w-full max-w-5xl rounded-[2rem] border border-stone-200 
        bg-white/80 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.16)]
        backdrop-blur-xl relative overflow-hidden
      "
                  >
                    {/* Decorative Glow Behind Card */}
                    <div className="absolute -top-10 -left-10 h-40 w-40 bg-amber-200/40 blur-3xl rounded-full pointer-events-none" />
                    <div className="absolute -bottom-10 -right-10 h-44 w-44 bg-stone-300/30 blur-3xl rounded-full pointer-events-none" />

                    {/* Header */}
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 relative z-10">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">Selected Property</p>

                        <h3 className="mt-1 text-xl font-bold text-stone-900 relative inline-block">
                          {selectedProperty.name}
                          <span className="absolute left-0 -bottom-1 h-[3px] w-full bg-amber-500/60 rounded-full scale-x-0 origin-left animate-[grow_0.6s_ease-out_forwards]" />
                        </h3>
                      </div>

                      <span className="inline-flex h-7 items-center rounded-full bg-stone-100 px-3 text-xs text-stone-600">
                        {selectedProperty.images.length} Images
                      </span>
                    </div>

                    {/* Image Grid */}
                    <motion.div
                      className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3"
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={{
                        hidden: {},
                        visible: {
                          transition: { staggerChildren: 0.1 },
                        },
                      }}
                    >
                      {selectedProperty.images.map((img: string, idx: number) => (
                        <motion.div
                          key={idx}
                          className="
              group relative h-48 w-full overflow-hidden 
              rounded-3xl border border-stone-200 bg-stone-100/50 
              shadow-md hover:shadow-lg transition-all duration-500
            "
                          initial={{ opacity: 0, y: 20, scale: 0.92 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.45, ease: 'easeOut' }}
                          whileHover={{
                            scale: 1.04,
                            y: -4,
                            rotate: 0.3,
                            boxShadow: '0 15px 40px rgba(0,0,0,0.25)',
                          }}
                        >
                          <Image
                            src={img}
                            alt={`${selectedProperty.name} ${idx + 1}`}
                            fill
                            className="object-cover transition-all duration-500 group-hover:scale-110"
                            sizes="(max-width:640px)100vw,33vw"
                          />

                          {/* Glossy Shine Effect */}
                          <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500">
                            <div
                              className="
                absolute inset-0 bg-gradient-to-r 
                from-transparent via-white/20 to-transparent 
                translate-x-[-120%] group-hover:translate-x-[120%]
                duration-700 
              "
                            />
                          </div>

                          {/* Bottom Gradient */}
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />
                        </motion.div>
                      ))}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* <section className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="space-y-8 lg:col-span-2">
                <div className="rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
                  <h2 className="text-xl font-semibold text-stone-900">{t('AgencyDetails.about_heading')}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-stone-600">{agencyData?.description || t('AgencyDetails.about_placeholder')}</p>

                  <div className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
                    <InfoItem label={t('AgencyDetails.primary_contact')} value={contactName || '—'} />
                    <InfoItem label={t('AgencyDetails.gst_number')} value={agencyData?.gstNumber || '—'} />
                    <InfoItem label={t('AgencyDetails.service_regions')} value={serviceRegions} />
                    <InfoItem
                      label={t('AgencyDetails.verification_status')}
                      value={isVerified ? t('AgencyDetails.verified') : t('AgencyDetails.not_verified')}
                    />
                  </div>
                </div>

                <div className="rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
                  <h3 className="text-lg font-semibold text-stone-900">{t('AgencyDetails.contact_information')}</h3>
                  <div className="mt-4 space-y-3 text-sm text-stone-600">
                    <InfoItem label={t('AgencyDetails.primary_contact')} value={contactName || '—'} icon={<CircleUserRound size={16} />} />
                    <InfoItem
                      label={t('form.email.label')}
                      value={contactEmail || '—'}
                      icon={<Mail size={16} />}
                      href={contactEmail ? `mailto:${contactEmail}` : undefined}
                    />
                    <InfoItem
                      label={t('form.phone_number.label')}
                      value={contactPhone || '—'}
                      icon={<Phone size={16} />}
                      href={contactPhone ? `tel:${contactPhone}` : undefined}
                    />
                    <InfoItem
                      label={t('AgencyDetails.address_heading')}
                      value={fullAddress || t('AgencyDetails.address_placeholder')}
                      icon={<MapPin size={16} />}
                    />
                  </div>
                </div>
              </div>

              <aside className="lg:col-span-1">
                <div className="sticky top-24 rounded-3xl border border-stone-200 bg-white p-7 shadow-lg">
                  <h3 className="text-xl font-semibold text-stone-900">{t('AgencyDetails.enquire_now')}</h3>
                  <p className="mb-6 mt-2 text-sm text-stone-600">{t('AgencyDetails.enquire_description')}</p>

                  <Formik initialValues={initialValues} validationSchema={AgencyEnquirySchema(t)} onSubmit={handleSubmit}>
                    {({ isSubmitting }) => (
                      <Form className="space-y-4">
                        <FormikTextField
                          label={t('form.name.label')}
                          type="text"
                          name="name"
                          placeholder={t('form.name.placeholder')}
                          className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                        />
                        <FormikTextField
                          label={t('form.email.label')}
                          type="email"
                          name="email"
                          placeholder={t('form.email.placeholder')}
                          className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                        />
                        <FormikTextField
                          label={t('form.phone_number.label')}
                          type="tel"
                          name="phone"
                          placeholder={t('form.phone_number.placeholder')}
                          className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                        />
                        <FormikTextField
                          label={t('form.message.label')}
                          type="textarea"
                          name="message"
                          placeholder={t('form.message.placeholder')}
                          className="h-28 w-full resize-none rounded-xl border border-stone-300 px-4 py-3 text-sm shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                        />
                        <Button
                          type="submit"
                          disabled={isSubmitting || !agencyData?.id}
                          className="flex w-full items-center justify-center gap-2 rounded-full bg-amber-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:bg-stone-300"
                        >
                          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                          {t('AgencyDetails.send_enquiry')}
                        </Button>
                      </Form>
                    )}
                  </Formik>
                </div>
              </aside>
            </section> */}
          </div>
        )}
      </div>
    </main>
  )
}
