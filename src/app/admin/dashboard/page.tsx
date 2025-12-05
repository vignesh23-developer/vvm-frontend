'use client'

import React from 'react'
import { Users, FileText, CreditCard, Home, ChartBar } from 'lucide-react'

function StatCard({ label, value, Icon }: { label: string; value: string | number; Icon: any }) {
  return (
    <div className="rounded-2xl border border-yellow-200 bg-gradient-to-br from-white to-yellow-50/30 p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase text-gray-600">{label}</p>
          <p className="mt-2 text-2xl font-bold text-[#2a1407]">{value}</p>
        </div>
        <div className="rounded-lg bg-gradient-to-br from-yellow-100 to-yellow-200/50 p-3 text-yellow-700">
          <Icon size={22} />
        </div>
      </div>
    </div>
  )
}

export default function AdminDashboardPage() {
  // Static placeholders — replace with real data hooks later
  const stats = [
    { label: 'Total Properties', value: 1284, Icon: FileText },
    { label: 'Active Agents', value: 342, Icon: Users },
    { label: 'Monthly Revenue', value: '₹ 1.2M', Icon: CreditCard },
    { label: 'New Listings', value: 78, Icon: Home },
  ]

  const recentItems = [
    { id: 'a1', title: 'New property listed - OMR', meta: '2 BHK • ₹ 75 L' },
    { id: 'a2', title: 'Agent: Green Homes', meta: 'Bengaluru • Verified' },
    { id: 'a3', title: 'Promoted listing - Anna Nagar', meta: '4 BHK • ₹ 2.4 Cr' },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-50 p-6">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-[#2a1407]">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-gray-600">Overview of system activity and recent events</p>
          </div>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(s => (
            <StatCard key={s.label} label={s.label} value={s.value} Icon={s.Icon} />
          ))}
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-2xl border border-yellow-200 bg-gradient-to-br from-white to-yellow-50/20 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#2a1407]">Activity Feed</h2>
              <div className="text-sm text-gray-600">Last 7 days</div>
            </div>

            <div className="mt-4 h-60 flex items-center justify-center rounded-md border border-dashed border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100/30">
              <div className="text-yellow-600 flex flex-col items-center">
                <ChartBar size={36} />
                <p className="mt-3 text-sm">Charts and analytics will appear here</p>
              </div>
            </div>
          </div>

          <aside className="rounded-2xl border border-yellow-200 bg-gradient-to-br from-white to-yellow-50/20 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-[#2a1407]">Recent Items</h3>
            <ul className="mt-4 space-y-3">
              {recentItems.map(item => (
                <li key={item.id} className="flex items-center justify-between rounded-md px-3 py-2 hover:bg-yellow-50">
                  <div>
                    <p className="text-sm font-medium text-[#2a1407]">{item.title}</p>
                    <p className="text-xs text-gray-600 mt-1">{item.meta}</p>
                  </div>
                  <div className="text-xs text-yellow-700">View</div>
                </li>
              ))}
            </ul>
          </aside>
        </section>
      </div>
    </main>
  )
}
