'use client'

import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

import type { PricingPlansClientProps, Plan, ApiPlan } from './types'
import { useUserSubscription } from './hooks/useUserSubscription'
import RazorpayPayment from '@/components/payment/RazorpayPayment'
import { convertToPaise } from './utils/featureUtils'

type PlanAction = NonNullable<Plan['planAction']>

interface EnrichedPlan extends Plan {
  planAction: PlanAction
  billingCycle: string
}

function normalizePrice(value: string | number | null | undefined): number {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0
  }

  if (typeof value !== 'string') {
    return 0
  }

  const parsed = Number(value.replace(/[₹,\s]/g, ''))
  return Number.isFinite(parsed) ? parsed : 0
}

function normalizeCycle(cycle: string | null | undefined): string {
  return cycle?.trim().toUpperCase() || 'MONTHLY'
}

function getPlanAction(
  plan: Plan,
  activeSubscription: ReturnType<typeof useUserSubscription>['activeSubscription'],
): PlanAction {
  if (!activeSubscription) {
    return 'subscribe'
  }

  if (plan.id === activeSubscription.plan_id) {
    return 'current'
  }

  const currentPrice = normalizePrice(
    activeSubscription.plan?.price ?? activeSubscription.paidAmount,
  )
  const planPrice = normalizePrice(plan.price)

  if (currentPrice <= 0) {
    return 'subscribe'
  }

  return planPrice > currentPrice ? 'upgrade' : 'downgrade'
}

function PricingPlansClientComponent({
  plans,
  featuresList,
  apiPlans,
}: PricingPlansClientProps) {
  const t = useTranslations()
  const {
    activeSubscription,
    error,
    loading: isLoading,
  } = useUserSubscription()

  const [activeTab, setActiveTab] = useState('MONTHLY')

  // Index API plans by ID for efficient lookup.
  const apiPlansById = useMemo(
    () => new Map<number, ApiPlan>(apiPlans.map((plan) => [plan.id, plan])),
    [apiPlans],
  )

  // Unique billing cycles, with monthly first.
  const billingCycles = useMemo(() => {
    const cycles = [
      ...new Set(apiPlans.map((plan) => normalizeCycle(plan.billingCycle))),
    ]

    return cycles.sort((a, b) => {
      if (a === 'MONTHLY') return -1
      if (b === 'MONTHLY') return 1
      return a.localeCompare(b)
    })
  }, [apiPlans])

  useEffect(() => {
    if (billingCycles.length > 0 && !billingCycles.includes(activeTab)) {
      setActiveTab(billingCycles[0])
    }
  }, [billingCycles, activeTab])

  const getCycleLabel = useCallback(
    (cycle: string) => {
      const normalized = cycle.toLowerCase()

      if (normalized === 'monthly' || normalized === 'yearly') {
        return t(`Pricing.${normalized}`)
      }

      return normalized.charAt(0).toUpperCase() + normalized.slice(1)
    },
    [t],
  )

  const getPeriodLabel = useCallback(
    (cycle: string) => {
      const normalized = normalizeCycle(cycle).toLowerCase()
      const key = normalized.replace(/ly$/, '')

      if (key === 'month' || key === 'year') {
        return t(`Pricing.${key}`)
      }

      return key
    },
    [t],
  )

  // Enrich plans only when source data or subscription changes.
  const enrichedPlans = useMemo<EnrichedPlan[]>(
    () =>
      plans.map((plan) => {
        const apiPlan = apiPlansById.get(plan.id)

        return {
          ...plan,
          planAction: getPlanAction(plan, activeSubscription),
          billingCycle: normalizeCycle(apiPlan?.billingCycle),
        }
      }),
    [plans, apiPlansById, activeSubscription],
  )

  const filteredPlans = useMemo(
    () => enrichedPlans.filter((plan) => plan.billingCycle === activeTab),
    [enrichedPlans, activeTab],
  )

  if (isLoading) {
    return (
      <div className="w-full bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mx-auto mb-16 h-10 w-64 animate-pulse rounded-full bg-gray-200" />

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[1, 2, 3].map((card) => (
              <div
                key={card}
                className="h-[500px] animate-pulse rounded-3xl border border-gray-100 bg-white p-8 shadow-sm"
              >
                <div className="mb-4 h-8 w-32 rounded-lg bg-gray-100" />
                <div className="mb-8 h-12 w-48 rounded-lg bg-gray-100" />

                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((line) => (
                    <div
                      key={line}
                      className="h-4 w-full rounded bg-gray-100"
                    />
                  ))}
                </div>

                <div className="mt-8 h-12 w-full rounded-xl bg-gray-200" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-8 w-full bg-gradient-to-br from-[#fffdf5] via-white to-yellow-50/30 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 inline-block rounded-full border border-yellow-200 bg-yellow-100 px-4 py-1.5 text-sm font-semibold text-yellow-800"
          >
            {t('Pricing.flexible_pricing')}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mb-6 text-4xl font-bold tracking-tight text-[#2a1407] md:text-5xl"
          >
            {t('Pricing.title')}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl leading-relaxed text-gray-500"
          >
            {t('Pricing.description')}
          </motion.p>
        </div>

        {/* Billing Cycle Tabs */}
        {billingCycles.length > 0 && (
          <div className="mb-12 flex justify-center">
            <div className="flex rounded-full bg-gray-100 p-1.5">
              {billingCycles.map((cycle) => (
                <button
                  key={cycle}
                  type="button"
                  aria-pressed={activeTab === cycle}
                  onClick={() => setActiveTab(cycle)}
                  className={`rounded-full px-6 py-2 text-sm font-semibold transition-all duration-300 ${
                    activeTab === cycle
                      ? 'bg-white text-[#2a1407] shadow-md'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {getCycleLabel(cycle)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Subscription Error */}
        {error && (
          <motion.div
            role="alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-8 rounded-xl border border-red-200 bg-red-50 p-4 text-center text-red-700"
          >
            {error}
          </motion.div>
        )}

        {/* Pricing Plans */}
        {filteredPlans.length > 0 ? (
          <div className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
            {filteredPlans.map((plan, index) => {
              const apiPlan = apiPlansById.get(plan.id)

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                  className={`relative z-0 flex flex-col rounded-3xl p-8 transition-all duration-300 ${
                    plan.highlight
                      ? 'z-10 scale-100 bg-gradient-to-b from-[#2a1407] to-[#1a0a04] text-white shadow-2xl ring-4 ring-yellow-500/20 lg:scale-105'
                      : 'group border border-yellow-100 bg-white text-gray-900 shadow-xl hover:border-yellow-300 hover:shadow-2xl'
                  }`}
                >
                  {/* Popular Badge */}
                  {plan.highlight && (
                    <div className="absolute left-1/2 top-0 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 whitespace-nowrap rounded-full bg-yellow-500 px-6 py-1.5 text-sm font-bold text-white shadow-lg">
                      <span className="text-lg" aria-hidden="true">
                        👑
                      </span>
                      {t('Pricing.most_popular')}
                    </div>
                  )}

                  {/* Plan Header */}
                  <div className="mb-8">
                    <h3
                      className={`mb-2 text-2xl font-bold ${
                        plan.highlight ? 'text-white' : 'text-[#2a1407]'
                      }`}
                    >
                      {plan.name}
                    </h3>

                    <div className="flex items-baseline gap-1">
                      <span
                        className={`text-4xl font-extrabold ${
                          plan.highlight ? 'text-yellow-400' : 'text-[#2a1407]'
                        }`}
                      >
                        {plan.price}
                      </span>

                      <span
                        className={`text-sm ${
                          plan.highlight ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        / {getPeriodLabel(activeTab)}
                      </span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-8 flex-1 space-y-4">
                    {plan.features.map((feature) => (
                      <div
                        key={feature.text}
                        className="flex items-start gap-3"
                      >
                        <div
                          className={`mt-0.5 rounded-full p-0.5 ${
                            plan.highlight
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          <svg
                            aria-hidden="true"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>

                        <span
                          className={`text-sm font-medium ${
                            plan.highlight
                              ? 'text-gray-300'
                              : 'text-gray-600 group-hover:text-gray-900'
                          }`}
                        >
                          {feature.text}

                          {typeof feature.value === 'string' &&
                            feature.value !== '' &&
                            feature.value !== 'Enabled' && (
                              <span
                                className={`font-bold ${
                                  plan.highlight
                                    ? 'text-white'
                                    : 'text-[#2a1407]'
                                }`}
                              >
                                {' - '}
                                {feature.value}
                              </span>
                            )}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Payment Action */}
                  <RazorpayPayment
                    planId={plan.id}
                    planName={plan.name}
                    amount={apiPlan ? convertToPaise(apiPlan.price) : 0}
                    planAction={plan.planAction}
                    activeSubscriptionId={activeSubscription?.id}
                    className={`w-full rounded-xl py-4 text-sm font-bold transition-all duration-300 ${
                      plan.planAction === 'current'
                        ? 'cursor-default bg-gray-100 text-gray-400'
                        : plan.highlight
                          ? 'bg-yellow-500 text-[#2a1407] shadow-lg hover:bg-yellow-400 hover:shadow-yellow-500/50'
                          : 'bg-[#2a1407] text-white shadow-md hover:bg-[#4a2e1d] hover:shadow-lg'
                    }`}
                    buttonText={
                      plan.planAction === 'current'
                        ? t('Pricing.current_plan')
                        : plan.planAction === 'upgrade'
                          ? t('Pricing.upgrade_plan')
                          : plan.planAction === 'downgrade'
                            ? t('Pricing.downgrade')
                            : t('Pricing.get_started')
                    }
                  />
                </motion.div>
              )
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-6 rounded-full bg-yellow-50 p-6">
              <span className="text-6xl" aria-hidden="true">
                🎁
              </span>
            </div>

            <h3 className="mb-2 text-2xl font-bold text-[#2a1407]">
              {t('Pricing.trial_title')}
            </h3>

            <p className="mx-auto max-w-md text-gray-500">
              {t('Pricing.trial_desc', {
                activeTab: t(`Pricing.${activeTab.toLowerCase()}`),
              })}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

const PricingPlansClient = memo(PricingPlansClientComponent)

PricingPlansClient.displayName = 'PricingPlansClient'

export default PricingPlansClient
