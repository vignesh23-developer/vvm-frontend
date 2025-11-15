'use client'

import { useCallback, useMemo, useState } from 'react'
import { useProperties } from '@/app/(seller)/properties/(hooks)/useProperties'
import { PropertiesDto } from '@/app/(seller)/properties/dto/PropertiesDto'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useRouter } from 'next/navigation'
import DataTable from '@/components/ui/CustomComponent/Tables/DataTable'
import Button from '@/components/ui/CustomComponent/Button/Button'
import { ArrowRight, Edit3, Trash2 } from 'lucide-react'

// Chart data

const COLORS = ['#4ade80', '#f87171', '#fbbf24']

const monthlyData = [
  { name: 'Jan', count: 2 },
  { name: 'Feb', count: 3 },
  { name: 'Mar', count: 4 },
  { name: 'Apr', count: 5 },
  { name: 'May', count: 3 },
]

type PropertiesTableRow = PropertiesDto & Record<string, unknown>

export default function PropertiesPage() {
  const router = useRouter()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const { properties, handleEdit, handleDelete, total, error, isLoading, mutateProperties, handlePropertyAction } = useProperties({ page, limit })
  const columns = [
    {
      field: 'title',
      title: 'Title',
      sortable: true,
      filterable: true,
    },
    {
      field: 'city',
      title: 'City',
      sortable: true,
      filterable: true,
    },
    {
      field: 'district',
      title: 'District',
      sortable: true,
      filterable: true,
    },
    {
      field: 'state',
      title: 'State',
      sortable: true,
      filterable: true,
    },
    {
      field: 'price',
      title: 'Price',
      sortable: true,
      filterable: true,
    },
    {
      field: 'status',
      title: 'Status',
      sortable: true,
      filterable: true,
      render: (item: any) => {
        const status = item

        const colorClass =
          status === 'AVAILABLE'
            ? 'bg-green-100 text-green-700 border border-green-300'
            : status === 'INACTIVE'
            ? 'bg-red-100 text-red-700 border border-red-300'
            : 'bg-yellow-100 text-yellow-700 border border-yellow-300'

        return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colorClass}`}>{status}</span>
      },
    },
    {
      field: 'contact_phone',
      title: 'Contact Number',
      sortable: true,
      filterable: true,
    },
  ]

  const actions = useMemo(
    () => [
      {
        label: 'Edit',
        icon: Edit3,
        onClick: (row: PropertiesTableRow) => {
          void handleEdit(row.id)
        },
        color: '#1e6897',
      },
      {
        label: 'Delete',
        icon: Trash2,
        onClick: (row: PropertiesTableRow) => {
          void handleDelete(row.id)
        },
        color: '#e02424',
      },
    ],
    [handleDelete, handleEdit],
  )

  const statusPieData = Object.values(
    (properties ?? []).reduce<Record<string, { name: string; value: number }>>((acc, prop) => {
      const status = String(prop.status ?? 'Unknown')
      if (!acc[status]) acc[status] = { name: status, value: 0 }
      acc[status].value += 1
      return acc
    }, {}),
  )

  const fetchProperties = useCallback(async (): Promise<{ data: PropertiesTableRow[]; totalItems: number }> => {
    const latestProperties = (properties ?? []) as PropertiesTableRow[]
    return {
      data: latestProperties,
      // Use the server total when available so DataTable computes correct pages
      totalItems: typeof total === 'number' ? total : latestProperties.length,
    }
  }, [properties])

  const handleRefresh = async () => {
    try {
      // If you need to perform any server-side work before refreshing, do it here.
      // The important part is to await the mutate so callers can wait for fresh data.
      await mutateProperties()
    } catch (err) {
      console.error('PropertiesPage: refresh failed', err)
      throw err instanceof Error ? err : new Error('Refresh failed')
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Properties</h1>
          <p className="text-gray-500">Manage and oversee all listed properties.</p>
        </div>
        <Button
          type="button"
          onClick={() => router.push('/properties-registration')}
          className="flex items-center gap-2 bg-[#7B1E1E] px-4 py-2 text-sm font-medium text-white rounded-md shadow-md hover:bg-[#641717] transition"
        >
          Properties Registration
          <ArrowRight size={16} />
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Button
          type="button"
          onClick={() => router.push('/admin/dashboard/properties')}
          className="flex items-center gap-2 bg-[#7B1E1E] hover:bg-[#641717] text-white text-sm font-medium px-4 py-2 rounded-md shadow-md transition-colors"
        >
          View your pending properties
          <ArrowRight size={16} />
        </Button>
      </div>

      {/* Layout */}
      <div className="">
        {/* Table Section */}
        <div className="bg-white rounded-xl shadow p-4">
          <DataTable
            columns={columns}
            actions={actions}
            fetchData={fetchProperties}
            loading={isLoading}
            isPagination={true}
            initialPage={page}
            pageSize={limit}
            totalItemsData={total}
            totalPageData={Math.ceil(total / limit)}
            pageSizeOptions={[5, 10, 25, 50, 100]}
            setPage={setPage}
            setCurrentPageSize={setLimit}
            onRefresh={handleRefresh}
          />
        </div>
        {/* Sidebar */}

        {/* <div className="space-y-6 mt-4"> */}
        {/* Pie Chart */}
        {/* <div className="bg-white rounded-xl shadow p-4">
            <h3 className="font-semibold mb-4 text-gray-700">Properties by Status</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={statusPieData} dataKey="value" nameKey="name" outerRadius={70} innerRadius={40}>
                  {statusPieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div> */}

        {/* Bar Chart */}
        {/* <div className="bg-white rounded-xl shadow p-4">
            <h3 className="font-semibold mb-4 text-gray-700">Properties Added Over Time</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div> */}

        {/* Agents */}
        {/* <div className="bg-white rounded-xl shadow p-4">
            <h3 className="font-semibold mb-4 text-gray-700">Top Performing Agents</h3>
            <ul className="space-y-2 text-gray-700">
              <li>🏆 Emnia Taylor</li>
              <li>🏆 Olivia Williams</li>
              <li>🏆 Noah Smith</li>
            </ul>
          </div> */}
        {/* </div> */}
      </div>
    </div>
  )
}
