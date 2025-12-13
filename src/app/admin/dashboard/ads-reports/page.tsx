'use client'

import { useCallback, useMemo, useState } from 'react'

import DataTable from '@/components/ui/CustomComponent/Tables/DataTable'
import CustomLoader from '@/components/ui/CustomComponent/Loader/CustomLoader'
import { useAdReports, AdReport } from '@/app/admin/dashboard/ads-reports/(hooks)/useAdReports'
import toast from 'react-hot-toast'

type AdReportTableRow = AdReport & Record<string, unknown>

export default function AdsReportsPage() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const { adReports, total, error, isLoading, mutateAdReports } = useAdReports({ page, limit })

  const columns = useMemo(
    () => [
      {
        field: 'title',
        title: 'Title',
        sortable: true,
        filterable: true,
        // DataRow passes (value, row) to render; use the row to read nested `ad.title` safely
        render: (_value: any, row: any) => {
          return <span>{row?.ad?.title ?? row?.title ?? 'N/A'}</span>
        },
      },
      {
        field: 'report_type',
        title: 'Report Type',
        sortable: true,
        filterable: true,
      },
      {
        field: 'severity',
        title: 'Severity',
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

  const fetchReports = useCallback(async () => {
    const latest = (adReports ?? []) as AdReportTableRow[]
    return {
      data: latest,
      totalItems: typeof total === 'number' ? total : latest.length,
    }
  }, [adReports, total])

  const handleRefresh = useCallback(async () => {
    try {
      await mutateAdReports()
    } catch (err) {
      console.error('Failed to refresh ads reports', err)
      toast.error('Failed to refresh ad reports')
    }
  }, [mutateAdReports])

  if (error) {
    return <div className="p-6 text-red-600">Failed to load ad reports.</div>
  }

  if (isLoading) {
    return <CustomLoader text="Loading ad reports..." />
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-wrap items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-800">Ad Reports</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <DataTable<AdReportTableRow>
          columns={columns}
          fetchData={fetchReports}
          initialPage={page}
          pageSize={limit}
          loading={isLoading}
          totalItemsData={total}
          totalPageData={limit ? Math.ceil((total ?? 0) / limit) : 0}
          pageSizeOptions={[5, 10, 25, 50, 100]}
          setPage={setPage}
          setCurrentPageSize={setLimit}
          onRefresh={handleRefresh}
          isPagination
        />
      </div>
    </div>
  )
}
