'use client'

import Link from 'next/link'
import { ArrowLeft, Download, Upload } from 'lucide-react'
import {
  Pie,
  PieChart,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import Table from '../../../components/ui/CustomComponent/Table/Table'
import { useUserSubscription } from '@/components/Plans/hooks/useUserSubscription'
import PlanUsageWidget from '@/components/dashboard/PlanUsageWidget'
import FeatureGate from '@/components/dashboard/FeatureGate'

/* ---------------- DATA ---------------- */
const stats = [
  { label: 'Total Leads', value: 1254 },
  { label: 'New Leads (This Month)', value: 120 },
  { label: 'Converted Leads', value: 340 },
  { label: 'Leads by Status', value: 85 },
]

const leads = [
  {
    name: 'Judith Miller',
    contact: '1 (6152) 010–6410',
    property: 'House',
    status: 'Converted',
    last: '23-07-2024',
  },
  {
    name: 'Dustin Pratt',
    contact: '1 (6471) 556–1234',
    property: 'Land',
    status: 'Pending',
    last: '04-01-2024',
  },
  {
    name: 'Michael Brown',
    contact: '1 (8135) 797–8998',
    property: 'Ad',
    status: 'New',
    last: '02-02-2025',
  },
  {
    name: 'Dustin Pratt',
    contact: '1 (8135) 797–8988',
    property: 'New',
    status: 'New',
    last: '08-02-2025',
  },
  {
    name: 'Judith Miller',
    contact: '1 (6471) 556–1234',
    property: 'New',
    status: 'New',
    last: '02-01-2024',
  },
  {
    name: 'Michael Brown',
    contact: '1 (6471) 556–1234',
    property: 'New',
    status: 'New',
    last: '04-01-2024',
  },
]

const pieData = [
  { name: 'New', value: 40, color: '#2a1407' },
  { name: 'Pending', value: 20, color: '#FACC15' },
  { name: 'Converted', value: 25, color: '#22C55E' },
  { name: 'Lost', value: 15, color: '#EF4444' },
]

const barData = [
  { name: 'Mon', value: 20 },
  { name: 'Tue', value: 40 },
  { name: 'Wed', value: 35 },
  { name: 'Thu', value: 50 },
  { name: 'Fri', value: 30 },
  { name: 'Sat', value: 45 },
  { name: 'Sun', value: 25 },
]

/* ---------------- COMPONENTS ---------------- */
const StatusBadge = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    New: 'bg-gradient-to-r from-yellow-50 to-yellow-100/50 text-[#2a1407] border border-yellow-200',
    Pending: 'bg-gradient-to-r from-yellow-100 to-yellow-200/50 text-yellow-800 border border-yellow-300',
    Converted: 'bg-green-100 text-green-700 border border-green-200',
    Lost: 'bg-red-100 text-red-700 border border-red-200',
  }
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
        colors[status] || 'bg-gray-100 text-gray-700'
      }`}
    >
      {status}
    </span>
  )
}

const leadColumns = [
  { key: 'name', header: 'Lead Name', sortable: true },
  { key: 'contact', header: 'Contact Info', sortable: true },
  { key: 'property', header: 'Property', sortable: true },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    render: (lead: any) => <StatusBadge status={lead.status} />,
  },
  { key: 'last', header: 'Last Contacted', sortable: true },
]

const StatsCard = ({ label, value }: { label: string; value: number }) => (
  <div className="bg-gradient-to-br from-white to-yellow-50/30 rounded-lg p-4 flex flex-col items-center justify-center shadow-sm border border-yellow-200 text-center">
    <h2 className="text-xl sm:text-2xl font-bold text-[#2a1407]">{value.toLocaleString()}</h2>
    <p className="text-gray-600 text-sm mt-1">{label}</p>
  </div>
)

const QuickActionButton = ({
  icon: Icon,
  label,
}: {
  icon: any
  label: string
}) => (
  <button className="w-full border border-yellow-200 rounded-md px-3 py-2 text-sm flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-50 to-yellow-100/50 hover:from-yellow-100 hover:to-yellow-200/50 text-[#2a1407] transition">
    <Icon className="w-4 h-4 shrink-0" />{' '}
    <span className="truncate">{label}</span>
  </button>
)

/* ---------------- MAIN PAGE ---------------- */
export default function DashboardPage() {
  const { activeSubscription } = useUserSubscription()

  // Very lightweight gating: if property limit is reached, lock “Import Leads” as an example.
  // (This keeps the pattern in place; we can apply the same gate to other widgets/actions.)
  const planItems = activeSubscription?.plan?.planItems ?? []
  const propertyLimitItem = planItems.find(pi => (pi.item?.name || '').toLowerCase().includes('property'))
  const isUnlimited = Boolean(propertyLimitItem?.isUnlimited)
  const propertyLimit = !isUnlimited ? Number(propertyLimitItem?.numericValue ?? 0) : null
  const propertyUsed = activeSubscription?.usages?.find(u => (u.item?.name || '').toLowerCase().includes('property'))?.usedCount ?? 0
  const isPropertyLimitReached = propertyLimit !== null && propertyLimit > 0 && Number(propertyUsed) >= propertyLimit

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-50">
      <div className="border-b border-yellow-200 bg-white/80 backdrop-blur px-4 sm:px-6 py-3">
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#2a1407] hover:text-yellow-700 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to overview
        </Link>
      </div>

      <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-6">
        {/* Header */}
        <header className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 items-start">
          <div className="lg:col-span-2 space-y-1">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#2a1407]">Dashboard</h1>
            <p className="text-gray-600 text-sm">Your performance, plan usage, and quick actions in one place.</p>
          </div>
          <PlanUsageWidget subscription={activeSubscription} />
        </header>

        {/* Stats */}
        <section className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {stats.map(s => (
            <StatsCard key={s.label} {...s} />
          ))}
        </section>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Table Section */}
          <section className="lg:col-span-2 bg-gradient-to-br from-white to-yellow-50/20 rounded-lg p-4 shadow-sm border border-yellow-200 overflow-x-auto">
            <h2 className="text-lg font-semibold text-[#2a1407] mb-4">Leads Table</h2>
            <div className="w-full">
              <Table
                columns={leadColumns}
                data={leads}
                enableSearch
                enableStatusFilter
                statusOptions={['New', 'Pending', 'Converted']}
                statusKey="status"
                enableDateFilter
                dateKey="last"
              />
            </div>
          </section>

          {/* Charts + Actions */}
          <aside className="space-y-6">
            {/* Charts */}
            <div className="bg-gradient-to-br from-white to-yellow-50/20 rounded-2xl p-4 sm:p-6 shadow-sm border border-yellow-200 space-y-6">
              <div>
                <h3 className="font-semibold text-[#2a1407] mb-2">Leads by Status</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" outerRadius={70}>
                      {pieData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div>
                <h3 className="font-semibold text-[#2a1407] mb-2">Leads Over Week</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={barData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#2a1407" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick Actions */}
            <FeatureGate
              locked={isPropertyLimitReached}
              title="Plan limit reached"
              description="You’ve reached your property listing limit. Upgrade to unlock more listings and tools."
            >
              <div className="bg-gradient-to-br from-white to-yellow-50/20 rounded-2xl p-4 sm:p-6 shadow-sm border border-yellow-200 space-y-4">
                <h3 className="font-semibold text-[#2a1407]">Quick Actions</h3>
                <QuickActionButton icon={Upload} label="Import Leads" />
                <QuickActionButton icon={Download} label="Export Leads" />
              </div>
            </FeatureGate>
          </aside>
        </div>
      </div>
    </div>
  )
}
