'use client'

import { Plus, Edit3, Trash2 } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import DataTable from '@/components/ui/CustomComponent/Tables/DataTable'
import { usePropertyEnquiry } from '@/app/admin/dashboard/property-enquiry/(hooks)/usePropertyEnquiry'
import { PropertyEnquiry } from '@/app/admin/dashboard/property-enquiry/(dto)/PropertyEnquiryType'
import CustomLoader from '@/components/ui/CustomComponent/Loader/CustomLoader'
import toast from 'react-hot-toast'
import { useSearchParams } from 'next/navigation'

export default function PropertyEnquiryPage() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const paramas = useSearchParams()
  const propertyId = paramas.get('propertyId')
  const { enquiries, total, error, isLoading, mutateEnquiries } = usePropertyEnquiry({ page, limit, propertyId: propertyId ?? undefined })

  // Columns definition

  const columns = useMemo(
    () => [
      {
        field: 'title',
        title: 'Property Title',
        sortable: true,
        filterable: true,
        render: (_value: unknown, item: PropertyEnquiry) => item.property?.title || item.title || 'N/A',
      },
      {
        field: 'district',
        title: 'District',
        sortable: true,
        filterable: true,
        render: (_value: unknown, item: PropertyEnquiry) => item.property?.district || item.district || 'N/A',
      },
      {
        field: 'city',
        title: 'City',
        sortable: true,
        filterable: true,
        render: (_value: unknown, item: PropertyEnquiry) => item.property?.city || item.city || 'N/A',
      },
      {
        field: 'listing_type',
        title: 'Listing Type',
        sortable: true,
        filterable: true,
        render: (_value: unknown, item: PropertyEnquiry) => item.property?.listing_type || item.listing_type || 'N/A',
      },
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
        title: 'Mobile Number',
        sortable: true,
        filterable: true,
      },
    ],
    [],
  )

  const fetchEnquiries = useCallback(async () => {
    const latestEnquiries = (enquiries ?? []) as PropertyEnquiry[]
    return {
      data: latestEnquiries,
      totalItems: latestEnquiries.length,
    }
  }, [enquiries])

  const handleRefresh = async () => {
    try {
      await mutateEnquiries()
    } catch (error) {
      toast.error('Failed to refresh property enquiries')
      console.error('Error refreshing enquiries:', error)
    }
  }

  // Handle loading and error states
  if (error) return <div className="p-6 text-red-600">Failed to load property enquiries.</div>

  if (isLoading) return <CustomLoader text="Loading property enquiries..." />

  // Render UI
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-800">Property Enquiries</h1>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <DataTable<PropertyEnquiry>
          columns={columns}
          fetchData={fetchEnquiries}
          reloadKey={enquiries}
          loading={isLoading}
          allowExport
          allowGrouping
          allowRefresh
          onRefresh={handleRefresh}
          initialPage={page}
          pageSize={limit}
          totalItemsData={total}
          totalPageData={Math.ceil(total / limit)}
          pageSizeOptions={[5, 10, 25, 50, 100]}
          setPage={setPage}
          setCurrentPageSize={setLimit}
        />
      </div>
    </div>
  )
}
