'use client'

import { useEffect } from 'react'
import { useNewsLetter } from './hooks/useNewsLetter'
import NewsletterTable from './NewsletterTable'
import { TrendingUp, Users, Calendar, BarChart3 } from 'lucide-react'

export default function Newsletter() {
  const { fetchNewsletters, fetchAnalytics, analytics, analyticsLoading } = useNewsLetter()

  useEffect(() => {
    fetchNewsletters({ page: 1, limit: 10 })
    fetchAnalytics()
  }, [])

  const handleRefresh = () => {
    fetchNewsletters({ page: 1, limit: 10 })
    fetchAnalytics()
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Newsletter Subscriptions</h1>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Subscriptions</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{analytics.grandTotal}</p>
              </div>
              <Users className="h-8 w-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{analytics.today.count}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className={`h-4 w-4 mr-1 ${analytics.today.growthPercentage >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                  <span className={`text-xs ${analytics.today.growthPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {analytics.today.growthPercentage >= 0 ? '+' : ''}{analytics.today.growthPercentage.toFixed(1)}%
                  </span>
                </div>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{analytics.thisWeek.count}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className={`h-4 w-4 mr-1 ${analytics.thisWeek.growthPercentage >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                  <span className={`text-xs ${analytics.thisWeek.growthPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {analytics.thisWeek.growthPercentage >= 0 ? '+' : ''}{analytics.thisWeek.growthPercentage.toFixed(1)}%
                  </span>
                </div>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{analytics.thisMonth.count}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className={`h-4 w-4 mr-1 ${analytics.thisMonth.growthPercentage >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                  <span className={`text-xs ${analytics.thisMonth.growthPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {analytics.thisMonth.growthPercentage >= 0 ? '+' : ''}{analytics.thisMonth.growthPercentage.toFixed(1)}%
                  </span>
                </div>
              </div>
              <BarChart3 className="h-8 w-8 text-indigo-500" />
            </div>
          </div>
        </div>
      )}

      {/* Loading Analytics */}
      {analyticsLoading && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
              <div className="h-20 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Newsletter Table */}
      <NewsletterTable onRefresh={handleRefresh} />
    </div>
  )
}

