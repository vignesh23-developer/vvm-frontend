'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useProperties } from '@/app/(seller)/properties/(hooks)/useProperties'
import { PropertiesDto } from '@/app/(seller)/properties/dto/PropertiesDto'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { redirect, useRouter } from 'next/navigation'
import DataTable from '@/components/ui/CustomComponent/Tables/DataTable'
import Button from '@/components/ui/CustomComponent/Button/Button'
import { ArrowRight, Edit3, Trash2, Eye, RefreshCcw, Heart, Phone } from 'lucide-react'
import CustomLoader from '@/components/ui/CustomComponent/Loader/CustomLoader'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/AuthContext/AuthContextProvider'
import PropertyStatusChangeModal from '../modal/propertiesStatusChangeModal'
import { Roles, getUserRoles, hasRole, type UserRole } from '@/utils/roles/roles'
import { formatPrice } from '@/utils/converter/formatPrice'
import { getMethod } from '@/services/service'
import { appEndpoints } from '@/services/endpoints'
import { useKycStatus } from '@/components/kyc/hooks/useKycStatus'

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
  const { user, token } = useAuth()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [isOpenStatusModal, setIsOpenStatusModal] = useState(false)
  const [propertyId, setPropertyId] = useState<string | null>(null)

  // KYC Verification Hook
  const { kycStatus, loading: isKycLoading, error: kycError, refetch } = useKycStatus()

  const handlePropertiesRegistrationClick = () => {
    if (!kycStatus?.isVerified) {
      router.push('/kyc-pending')
    } else {
      router.push('/properties-registration')
    }
  }

  // console.log('PropertiesPage: user', user)
  const userRoles = getUserRoles(user)

  // console.log('PropertiesPage: userRoles', userRoles)
  const onlyAdmin = hasRole(userRoles, [Roles.ADMIN])
  const canChangeStatus = hasRole(userRoles, [Roles.ADMIN])
  const { properties, handleView, handleEdit, handleDelete, total, error, isLoadingProperties, mutateProperties, handlePropertyAction } =
    useProperties({
      page,
      limit,
    })

  const handleStatusChange = async (propertyId: string) => {
    setIsOpenStatusModal(true)
    setPropertyId(propertyId)
  }

  const columns = [
    // {
    //   field: 'sno',
    //   title: 'S.No',
    //   sortable: true,
    //   filterable: true,
    // },
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
      render: (value: any) => {
        return formatPrice(value)
      },
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
            : status === 'SOLD'
            ? 'bg-red-100 text-red-700 border border-red-300'
            : 'bg-yellow-100 text-yellow-700 border border-yellow-300'

        return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colorClass}`}>{status}</span>
      },
    },
    {
      field: 'approval_status',
      title: 'Approval Status',
      sortable: true,
      filterable: true,
      render: (item: any) => {
        const approvalStatus = item

        const colorClass =
          approvalStatus === 'UNDER_REVIEW'
            ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
            : approvalStatus === 'APPROVED'
            ? 'bg-green-100 text-green-700 border border-green-300'
            : 'bg-red-100 text-red-700 border border-red-300'

        return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colorClass}`}>{approvalStatus}</span>
      },
    },
    {
      field: 'contact_phone',
      title: 'Contact Number',
      sortable: true,
      filterable: true,
    },
    {
      field: 'view_count',
      title: 'Views',
      sortable: true,
      filterable: true,
      render: (value: unknown) => {
        const n = Number(value ?? 0)
        const label = n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n)
        return (
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 text-sm font-medium text-gray-900">
            <Eye className="w-4 h-4 text-gray-600" />
            <span>{label}</span>
          </div>
        )
      },
    },
    {
      field: 'favorite_count',
      title: 'Favorites',
      sortable: true,
      filterable: true,
      render: (value: unknown) => {
        const n = Number(value ?? 0)
        const label = n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n)
        return (
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 text-sm font-medium text-gray-900">
            <Heart className="w-4 h-4 text-red-500" />
            <span>{label}</span>
          </div>
        )
      },
    },
    {
      field: 'contact_count',
      title: 'Enquiries',
      sortable: true,
      filterable: true,
      render: (value: unknown) => {
        const n = Number(value ?? 0)
        const label = n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n)
        return (
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 text-sm font-medium text-gray-900">
            <Phone className="w-4 h-4 text-green-600" />
            <span>{label}</span>
          </div>
        )
      },
    },
  ]

  const actions = useMemo(() => {
    const base = [
      {
        icon: Eye, // correct for view
        onClick: (row: PropertiesTableRow) => {
          void handleView(row.id)
        },
        color: '#2a1407',
        title: 'View',
      },
      {
        icon: Edit3, // correct for edit
        onClick: (row: PropertiesTableRow) => {
          void handleEdit(row.id)
        },
        color: '#2a1407',
        title: 'Edit',
      },
    ]

    if (onlyAdmin) {
      // place change-status action at the front
      base.unshift({
        icon: RefreshCcw,
        onClick: (row: PropertiesTableRow) => {
          void handleStatusChange(row.id)
        },
        color: '#2a1407',
        title: 'Change Status',
      })
      base.push({
        icon: Trash2, // correct for delete
        onClick: (row: PropertiesTableRow) => {
          void handleDelete(row.id, !row.isActive)
        },
        color: '#e02424',
        title: 'Delete',
      })
    }

    return base
  }, [canChangeStatus, handleDelete, handleEdit, handleStatusChange, handleView])

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
      await mutateProperties()
    } catch (err) {
      console.error('PropertiesPage: refresh failed', err)
      toast.error('Failed to refresh properties')
    }
  }

  {
    isLoadingProperties && <CustomLoader text="Loading Properties List..." />
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-yellow-50 via-white to-yellow-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#2a1407]">Properties</h1>
          <p className="text-gray-600">Manage and oversee all listed properties.</p>
        </div>
        <Button
          type="button"
          onClick={handlePropertiesRegistrationClick}
          className="flex items-center gap-2 bg-[#2a1407] hover:from-[#3b1804] hover:to-[#2a1407] px-4 py-2 text-sm font-medium text-white rounded-md shadow-md transition"
        >
          Properties Registration
          <ArrowRight size={16} />
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {onlyAdmin && (
          <Button
            type="button"
            onClick={() => router.push('/admin/dashboard/properties-pending-approval')}
            className="flex items-center gap-2 bg-[#2a1407] hover:from-[#2a1407] hover:to-[#2a1407] text-white text-sm font-medium px-4 py-2 rounded-md shadow-md transition-colors"
          >
            View your pending properties
            <ArrowRight size={16} />
          </Button>
        )}
      </div>

      {/* Layout */}
      <div className="">
        {/* Table Section */}
        <div className="bg-gradient-to-br from-white to-yellow-50/20 rounded-xl shadow border border-yellow-200 p-4">
          <DataTable
            columns={columns}
            actions={actions}
            fetchData={fetchProperties}
            loading={isLoadingProperties}
            isPagination={true}
            initialPage={page}
            pageSize={limit}
            totalItemsData={total}
            totalPageData={Math.ceil(total / limit)}
            pageSizeOptions={[5, 10, 25, 50, 100]}
            setPage={setPage}
            setCurrentPageSize={setLimit}
            onRefresh={handleRefresh}
            allowExport
            allowGrouping
            allowRefresh
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
      <PropertyStatusChangeModal
        isOpenStatusModal={isOpenStatusModal}
        setIsOpenStatusModal={setIsOpenStatusModal}
        propertyId={propertyId!}
        propertyRefresh={mutateProperties}
      />
    </div>
  )
}
