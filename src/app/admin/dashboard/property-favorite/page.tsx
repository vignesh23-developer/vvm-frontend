'use client'

import { Plus, Edit3, Trash2 } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import DataTable from '@/components/ui/CustomComponent/Tables/DataTable'
import CustomLoader from '@/components/ui/CustomComponent/Loader/CustomLoader'
import { PropertyFavorite } from './(dto)/PropertyFavoriteType'
import { usePropertyFavorite } from './(hooks)/usePropertyFavorite'
import toast from 'react-hot-toast'

type PropertyFavoriteTableRow = PropertyFavorite & Record<string, unknown>

export default function PropertyFavoritePage() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const { favorites, total, error, isLoading, mutateFavorites } = usePropertyFavorite({ page, limit })

  console.log('Favorites:', favorites)

  // Columns definition

  const columns = useMemo(
    () => [
      {
        field: 'title',
        title: 'Title',
        sortable: true,
        filterable: true,
      },
      {
        field: 'favorite_count',
        title: 'Favorite Count',
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
    ],
    [],
  )

  const fetchFavorites = useCallback(async () => {
    const latestFavorites = (favorites ?? []) as PropertyFavoriteTableRow[]
    return {
      data: latestFavorites,
      totalItems: latestFavorites.length,
    }
  }, [favorites])

  const handleRefresh = async () => {
    try {
      await mutateFavorites()
    } catch (error) {
      console.error('Error refreshing favorites:', error)
      toast.error('Failed to refresh property favorites')
    }
  }

  // Handle loading and error states
  if (error) return <div className="p-6 text-red-600">Failed to load property favorites.</div>

  if (isLoading) return <CustomLoader text="Loading property favorites..." />

  // Render UI
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-800">Property Favorites</h1>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <DataTable<PropertyFavoriteTableRow>
          columns={columns}
          fetchData={fetchFavorites}
          reloadKey={favorites}
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
