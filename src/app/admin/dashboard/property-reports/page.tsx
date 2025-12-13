'use client'

import { Plus, Settings, Edit3, Trash2 } from 'lucide-react'
import { useState, useMemo, useCallback } from 'react'
import Table from '@/components/ui/CustomComponent/Table/Table'
import DataTable from '@/components/ui/CustomComponent/Tables/DataTable'
import { usePropertyReports, PropertyReports } from '@/app/admin/dashboard/property-reports/(hooks)/usePropertyReport'
import CustomLoader from '@/components/ui/CustomComponent/Loader/CustomLoader'
import toast from 'react-hot-toast'
import { useSearchParams } from 'next/navigation'

type PropertyReportsTableRow = PropertyReports & Record<string, unknown>

export default function PropertyReportsPage() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const searchParams = useSearchParams()
  const propertyId = searchParams.get('propertyId')
  const {
    reports,
    total,
    error,
    isLoading,
    mutateReports, // now included
  } = usePropertyReports({ page, limit, propertyId: propertyId ?? undefined })

  console.log('Property Reports Page - reports:', reports)
  // Columns definition
  const columns = useMemo(
    () => [
      {
        field: 'title',
        title: 'Title',
        sortable: true,
        filterable: true,
        // DataRow passes (value, row) to render; use the row to read nested `property.title` safely
        render: (_value: any, row: any) => {
          return <span>{row?.property?.title ?? row?.title ?? 'N/A'}</span>
        },
      },
      {
        field: 'report_type',
        title: 'Report Type',
        sortable: true,
        filterable: true,
      },

      {
        field: 'description',
        title: 'Description',
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
            status === ''
              ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
              : status === 'AVAILABLE'
              ? 'bg-green-100 text-green-700 border border-green-300'
              : 'bg-red-100 text-red-700 border border-red-300'

          return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colorClass}`}>{status}</span>
        },
      },
    ],
    [],
  )

  const fetchReports = useCallback(async (): Promise<{ data: PropertyReportsTableRow[]; totalItems: number }> => {
    const latestReports = (reports ?? []) as PropertyReportsTableRow[]
    return {
      data: latestReports,
      totalItems: typeof total === 'number' ? total : latestReports.length,
    }
  }, [reports, total])

  const handleRefresh = async () => {
    try {
      await mutateReports()
    } catch (err) {
      console.error('PropertiesPage: refresh failed', err)
      toast.error('Failed to refresh property reports')
    }
  }

  // Handle loading and error states
  if (error) return <div className="p-6 text-red-600">Failed to load property reports.</div>

  if (isLoading) return <CustomLoader text="Loading property reports..." />

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-800">Property Reports</h1>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <DataTable<PropertyReportsTableRow>
          columns={columns}
          fetchData={fetchReports}
          initialPage={page}
          pageSize={limit}
          loading={isLoading}
          totalItemsData={total}
          totalPageData={Math.ceil(total / limit)}
          pageSizeOptions={[5, 10, 25, 50, 100]}
          setPage={setPage}
          setCurrentPageSize={setLimit}
          onRefresh={handleRefresh}
          isPagination={true}
        />
      </div>
    </div>
  )
}
