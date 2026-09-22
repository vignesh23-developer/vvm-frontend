'use client'

import { useCallback, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'

import DataTable from '@/components/ui/CustomComponent/Tables/DataTable'
import CustomLoader from '@/components/ui/CustomComponent/Loader/CustomLoader'
import { useAdEnquiry } from './(hooks)/useAdEnquiry'
import { AdEnquiry } from './(dto)/AdEnquiryType'

type AdEnquiryTableRow = AdEnquiry & Record<string, unknown>

export default function AdsEnquiryPage() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const params = useSearchParams()
  const adsId = params.get('adsId')
  const { enquiries, total, error, isLoading, mutateEnquiries } = useAdEnquiry({ page, limit, adsId: adsId ?? undefined })

  const columns = useMemo(
    () => [
      {
        field: 'name',
        title: 'Name',
        sortable: true,
        filterable: true,
      },
      {
        field: 'email',
        title: 'Email',
        sortable: true,
        filterable: true,
      },
      {
        field: 'phone',
        title: 'Phone Number',
        sortable: true,
        filterable: true,
      },
      {
        field: 'created_at',
        title: 'Created At',
        sortable: true,
        filterable: true,
      },
    ],
    [],
  )

  const fetchEnquiries = useCallback(async () => {
    const latest = (enquiries ?? []) as AdEnquiryTableRow[]
    return {
      data: latest,
      totalItems: typeof total === 'number' ? total : latest.length,
    }
  }, [enquiries, total])

  const handleRefresh = useCallback(async () => {
    try {
      await mutateEnquiries()
    } catch (err) {
      console.error('Failed to refresh ad enquiries', err)
    }
  }, [mutateEnquiries])

  if (error) {
    return <div className="p-6 text-red-600">Failed to load ad enquiries.</div>
  }

  if (isLoading) {
    return <CustomLoader text="Loading ad enquiries..." />
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-wrap items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-800">Ad Enquiries</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <DataTable<AdEnquiryTableRow>
          columns={columns}
          fetchData={fetchEnquiries}
          reloadKey={enquiries}
          loading={isLoading}
          initialPage={page}
          pageSize={limit}
          totalItemsData={total}
          totalPageData={limit ? Math.ceil((total ?? 0) / limit) : 0}
          pageSizeOptions={[5, 10, 25, 50, 100]}
          setPage={setPage}
          setCurrentPageSize={setLimit}
          onRefresh={handleRefresh}
        />
      </div>
    </div>
  )
}
