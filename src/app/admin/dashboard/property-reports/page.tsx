'use client'

import { Plus, Settings, Edit3, Trash2 } from 'lucide-react'
import { useState, useMemo, useCallback } from 'react'
import Table from '@/components/ui/CustomComponent/Table/Table'
import DataTable from '@/components/ui/CustomComponent/Tables/DataTable'
import { usePropertyReports, PropertyReports } from '@/hooks/CustomHooks/usePropertyReport'
import CustomLoader from '@/components/ui/CustomComponent/Loader/CustomLoader'

type PropertyReportsTableRow = PropertyReports & Record<string, unknown>

export default function PropertyReportsPage() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const {
    reports,
    total,
    error,
    isLoading,
    mutateReports, // now included
  } = usePropertyReports({ page, limit })

  console
  // Columns definition
  const columns = useMemo(
    () => [
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
      // If you need to perform any server-side work before refreshing, do it here.
      // The important part is to await the mutate so callers can wait for fresh data.
      await mutateReports()
    } catch (err) {
      console.error('PropertiesPage: refresh failed', err)
      throw err instanceof Error ? err : new Error('Refresh failed')
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
