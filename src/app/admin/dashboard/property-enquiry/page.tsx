'use client'

import { Plus, Edit3, Trash2 } from 'lucide-react'
import { useCallback, useMemo } from 'react'
import DataTable from '@/components/ui/CustomComponent/Tables/DataTable'
import { usePropertyEnquiry } from '@/app/admin/dashboard/property-enquiry/(hooks)/usePropertyEnquiry'
import { PropertyEnquiry } from '@/app/admin/dashboard/property-enquiry/(dto)/PropertyEnquiryType'

type PropertyEnquiryTableRow = PropertyEnquiry & Record<string, unknown>

export default function PropertyEnquiryPage() {
  const {
    enquiries,
    error,
    isLoading,
    mutateEnquiries, // ✅ now included
  } = usePropertyEnquiry()

  // ✅ Columns definition

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
        title: 'Mobile Number',
        sortable: true,
        filterable: true,
      },
    ],
    [],
  )

  const fetchEnquiries = useCallback(async () => {
    const latestEnquiries = (enquiries ?? []) as PropertyEnquiryTableRow[]
    return {
      data: latestEnquiries,
      totalItems: latestEnquiries.length,
    }
  }, [enquiries])

  // ✅ Handle loading and error states
  if (error) return <div className="p-6 text-red-600">Failed to load property enquiries.</div>

  if (isLoading) return <div className="p-6 text-gray-600 animate-pulse">Loading property enquiries...</div>

  // ✅ Render UI
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-800">Property Enquiries</h1>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <DataTable<PropertyEnquiryTableRow> columns={columns} fetchData={fetchEnquiries} loading={isLoading} allowExport allowGrouping allowRefresh />
      </div>
    </div>
  )
}
