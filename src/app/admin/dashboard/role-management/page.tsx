'use client'

import { useCallback, useMemo, useState } from 'react'
import { Plus, Edit3, Trash2 } from 'lucide-react'
import {
  useRoleManagement,
  type RoleManagement,
} from '@/hooks/CustomHooks/useRoleManagement'
import DataTable from '@/components/ui/CustomComponent/Tables/DataTable'

type RoleTableRow = RoleManagement & Record<string, unknown>

export default function RoleManagementPage() {
  const { error, isLoading, handleAdd, handleEdit, handleDelete, mutateRoles } =
    useRoleManagement()

  const [tableInstanceKey, setTableInstanceKey] = useState(0)

  const columns = useMemo(
    () => [
      {
        field: 'name',
        title: 'Role Name',
        sortable: true,
        filterable: true,
      },
      {
        field: 'description',
        title: 'Description',
        sortable: true,
        filterable: true,
      },
    ],
    [],
  )

  const fetchRoles = useCallback(async () => {
    const latestRoles = ((await mutateRoles()) ?? []) as RoleTableRow[]
    return {
      data: latestRoles,
      totalItems: latestRoles.length,
    }
  }, [mutateRoles])

  const handleDeleteRole = useCallback(
    async (id: number) => {
      await handleDelete(id)
      setTableInstanceKey(previous => previous + 1)
    },
    [handleDelete],
  )

  const actions = useMemo(
    () => [
      {
        label: 'Edit',
        icon: Edit3,
        onClick: (row: RoleTableRow) => handleEdit(row.id),
        color: '#1e6897',
      },
      {
        label: 'Delete',
        icon: Trash2,
        onClick: (row: RoleTableRow) => {
          void handleDeleteRole(row.id)
        },
        color: '#e02424',
      },
    ],
    [handleDeleteRole, handleEdit],
  )

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">Role Management</h1>

        <button
          onClick={handleAdd}
          type="button"
          className="flex items-center gap-2 rounded-md bg-[#7B1E1E] px-4 py-2 text-sm font-medium text-white shadow-md transition hover:bg-[#641717]"
        >
          <Plus size={16} /> Add Role
        </button>
      </div>

      {error ? (
        <div className="rounded-md bg-red-50 p-6 text-center text-sm font-medium text-red-600">
          Failed to load roles.
        </div>
      ) : (
        <DataTable<RoleTableRow>
          key={tableInstanceKey}
          tableName="Roles"
          columns={columns}
          fetchData={fetchRoles}
          actions={actions}
          loading={isLoading}
          allowExport
          allowGrouping
          allowRefresh
        />
      )}
    </div>
  )
}
