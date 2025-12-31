'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, Users, DollarSign, Calendar, TrendingUp } from 'lucide-react'
import { getMethod } from '@/services/service'
import { appEndpoints } from '@/services/endpoints'
import { ResponseDTO } from '@/components/dto/response_dto'
import Pagination from '@/components/ui/CustomComponent/Paginations/Pagination'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/AuthContext/AuthContextProvider'

interface Referral {
  id: string
  firstName: string
  lastName: string
  email: string
  roles: string[]
  createdAt: string
}

interface ReferralInfo {
  referralCode: string
  totalReferrals: number
  referrals: Referral[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

interface ReferralAnalytics {
  today: { count: number; amount: number }
  week: { count: number; amount: number }
  month: { count: number; amount: number }
  year: { count: number; amount: number }
  total: { count: number; amount: number }
}

export default function MyReferralsPage() {
  const { user } = useAuth()
  const [referralInfo, setReferralInfo] = useState<ReferralInfo | null>(null)
  const [analytics, setAnalytics] = useState<ReferralAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [sort, setSort] = useState('DESC')
  const [orderBy, setOrderBy] = useState('createdAt')
  const [copied, setCopied] = useState(false)

  const fetchReferralData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch referral info with pagination
      const referralResponse = await getMethod<ReferralInfo>(
        appEndpoints.getUserRefferrals,
        { page, limit, sort, orderBy }
      )

      // Fetch analytics
      const analyticsResponse = await getMethod<ReferralAnalytics>(
        appEndpoints.getReferralAnalytics
      )

      if (referralResponse.error || !referralResponse.data) {
        throw new Error(referralResponse.message || 'Failed to fetch referral data')
      }

      if (analyticsResponse.error || !analyticsResponse.data) {
        throw new Error(analyticsResponse.message || 'Failed to fetch analytics')
      }

      setReferralInfo(referralResponse.data)
      setAnalytics(analyticsResponse.data)
    } catch (err: any) {
      console.error('Error fetching referral data:', err)
      setError(err.message || 'Failed to load referral data')
      toast.error(err.message || 'Failed to load referral data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReferralData()
  }, [page, limit, sort, orderBy])

  const handleCopyLink = () => {
    if (!referralInfo?.referralCode) return

    const referralLink = `${window.location.origin}/signup?referralCode=${referralInfo.referralCode}`
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    toast.success('Referral link copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = String(date.getFullYear()).slice(-2)
    return `${day}/${month}/${year}`
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    let hours = date.getHours()
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const ampm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12
    hours = hours ? hours : 12
    return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`
  }

  const formatRoles = (roles: string[]) => {
    return roles.join(', ') || 'BUYER'
  }

  if (loading && !referralInfo) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2a1407] mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading referral data...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error && !referralInfo) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">My Referrals</h1>
          <p className="text-gray-600">Track your referrals and earnings</p>
        </motion.div>

        {/* Analytics Boxes */}
        {analytics && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8"
          >
            {/* Today */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                <span className="text-xs text-gray-500">Today</span>
              </div>
              <div className="text-2xl font-bold text-gray-800">{analytics.today.count}</div>
              <div className="text-sm text-gray-600">₹{analytics.today.amount}</div>
            </div>

            {/* This Week */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <span className="text-xs text-gray-500">This Week</span>
              </div>
              <div className="text-2xl font-bold text-gray-800">{analytics.week.count}</div>
              <div className="text-sm text-gray-600">₹{analytics.week.amount}</div>
            </div>

            {/* This Month */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <Calendar className="w-5 h-5 text-purple-500" />
                <span className="text-xs text-gray-500">This Month</span>
              </div>
              <div className="text-2xl font-bold text-gray-800">{analytics.month.count}</div>
              <div className="text-sm text-gray-600">₹{analytics.month.amount}</div>
            </div>

            {/* This Year */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <Calendar className="w-5 h-5 text-orange-500" />
                <span className="text-xs text-gray-500">This Year</span>
              </div>
              <div className="text-2xl font-bold text-gray-800">{analytics.year.count}</div>
              <div className="text-sm text-gray-600">₹{analytics.year.amount}</div>
            </div>

            {/* Total */}
            <div className="bg-gradient-to-br from-[#2a1407] to-[#5a2a0a] rounded-lg shadow-md p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-5 h-5" />
                <span className="text-xs text-white/80">Total</span>
              </div>
              <div className="text-2xl font-bold">{analytics.total.count}</div>
              <div className="text-sm text-white/90">₹{analytics.total.amount}</div>
            </div>
          </motion.div>
        )}

        {/* Referral Link Section */}
        {referralInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-6 mb-8 border border-yellow-200"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Your Referral Link</h3>
                <div className="bg-white rounded-md p-3 border border-yellow-300 flex items-center gap-2">
                  <input
                    type="text"
                    value={`${typeof window !== 'undefined' ? window.location.origin : ''}/signup?referralCode=${referralInfo.referralCode}`}
                    readOnly
                    className="flex-1 bg-transparent text-sm text-gray-700 outline-none"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-4 py-2 bg-[#2a1407] text-white rounded-md hover:bg-[#5a2a0a] transition-colors flex items-center gap-2 text-sm"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Referrals Table */}
        {referralInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Referral History</h2>
              <p className="text-sm text-gray-600 mt-1">
                Total: {referralInfo.totalReferrals} referrals
              </p>
            </div>

            {referralInfo.referrals.length === 0 ? (
              <div className="p-12 text-center">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No referrals yet</p>
                <p className="text-sm text-gray-500 mt-2">
                  Share your referral link to start earning!
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          S.No
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Roles
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Money Earned
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Time
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {referralInfo.referrals.map((referral, index) => (
                        <tr key={referral.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {(page - 1) * limit + index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {referral.firstName} {referral.lastName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {referral.email || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {formatRoles(referral.roles)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                            ₹20
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {formatDate(referral.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {formatTime(referral.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {referralInfo.pagination.totalPages > 1 && (
                  <div className="p-6 border-t border-gray-200">
                    <Pagination
                      currentPage={page}
                      onPageChange={setPage}
                      totalItems={referralInfo.pagination.total}
                      itemsPerPage={limit}
                    />
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}

