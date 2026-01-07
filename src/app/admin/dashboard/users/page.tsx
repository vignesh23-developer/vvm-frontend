'use client'

import { useCallback, useMemo, useState } from 'react'
import DataTable from '@/components/ui/CustomComponent/Tables/DataTable'
import { useUsersHook } from './(hooks)/useUsersHook'
import { UserDataType } from './(dto)/userType'

type UserDataTableRow = UserDataType & Record<string, unknown>

export default function UserManagementPage() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const { users, total, isLoading, handleRefreshUsers } = useUsersHook(page, limit)

  const fetchUsersForTable = useCallback(async () => {
    return {
      data: users,
      totalItems: total,
    }
  }, [users, total])

  const columns = useMemo(
    () => [
      {
        field: 'firstName',
        title: 'First Name',
        sortable: true,
        filterable: true,
      },
      {
        field: 'lastName',
        title: 'Last Name',
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
        field: 'phoneNumber',
        title: 'Phone Number',
        sortable: true,
        filterable: true,
      },
      {
        field: 'roles',
        title: 'User Type',
        sortable: true,
        filterable: true,
        render: (item: any) => {
          const roles: string[] = Array.isArray(item) ? item : Array.isArray(item?.roles) ? item.roles : []

          if (roles.length === 0) return null

          let userType = 'BUYER'
          let colorClass = 'bg-blue-100 text-blue-700 border border-blue-300'

          if (roles.length === 2) {
            userType = 'AGENT'
            colorClass = 'bg-green-100 text-green-700 border border-green-300'
          }

          if (roles.length >= 3) {
            userType = 'ADMIN'
            colorClass = 'bg-yellow-100 text-yellow-700 border border-yellow-300'
          }

          return <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${colorClass}`}>{userType}</span>
        },
      },
      {
        field: 'isKycVerified',
        title: 'KYC Verified',
        sortable: true,
        filterable: true,
        render: (item: any) => {
          const isVerified = Boolean(item)

          return isVerified ? (
            <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 border border-green-300">Yes</span>
          ) : (
            <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 border border-red-300">No</span>
          )
        },
      },
      {
        field: 'createdAt',
        title: 'Created At',
        sortable: true,
        filterable: true,
        render: (item: any) => {
          if (!item) return '-'

          return new Intl.DateTimeFormat('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }).format(new Date(item))
        },
      },
    ],
    [],
  )

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-800">User Details</h1>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <DataTable<UserDataTableRow>
          columns={columns}
          fetchData={fetchUsersForTable}
          reloadKey={users}
          loading={isLoading}
          allowExport
          allowGrouping
          allowRefresh
          onRefresh={handleRefreshUsers}
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
