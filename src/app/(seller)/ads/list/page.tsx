'use client'

import { useCallback, useState, useMemo } from 'react'
import { useAds } from '@/app/(seller)/ads/(hooks)/useAds'
import { useAdsCategories } from '@/app/(seller)/ads/(hooks)/useAdsCategories'
import { AdsDto } from '@/app/(seller)/ads/dto/AdsDto'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useRouter } from 'next/navigation'
import DataTable from '@/components/ui/CustomComponent/Tables/DataTable'
import Pagination from '@/components/ui/CustomComponent/Tables/Pagination'
import Button from '@/components/ui/CustomComponent/Button/Button'
import { Edit, Trash2 } from 'lucide-react'
import { onDeleteAd } from '@/app/(seller)/ads/(action)/ads_action'
import toast from 'react-hot-toast'

// Chart data - these would ideally be calculated from the actual ads data
const statusData = [
  { name: 'Available', value: 0 },
  { name: 'Sold', value: 0 },
  { name: 'Reserved', value: 0 },
]

const COLORS = ['#4ade80', '#f87171', '#fbbf24']

const monthlyData = [
  { name: 'Jan', count: 0 },
  { name: 'Feb', count: 0 },
  { name: 'Mar', count: 0 },
  { name: 'Apr', count: 0 },
  { name: 'May', count: 0 },
]

type AdsTableRow = AdsDto & Record<string, unknown>

export default function AdsListPage() {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [currentLimit, setCurrentLimit] = useState(10)
  
  // Fetch ads with current page and limit - triggers API call when these change
  const { ads, total, error, isLoading, mutateAds } = useAds({ page: currentPage, limit: currentLimit })
  const { categories } = useAdsCategories()

  // Create a map for quick category lookup
  const categoryMap = useMemo(() => {
    return categories.reduce((acc, cat) => {
      acc[cat.id] = cat.name
      return acc
    }, {} as Record<string, string>)
  }, [categories])

  const columns = [
    {
      field: 'title',
      title: 'Title',
      sortable: true,
      filterable: true,
    },
    {
      field: 'category_id',
      title: 'Category',
      sortable: true,
      filterable: true,
      render: (value: unknown) => {
        const categoryId = value as string
        return categoryMap[categoryId] || 'Unknown'
      },
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
    },
    {
      field: 'status',
      title: 'Status',
      sortable: true,
      filterable: true,
    },
    {
      field: 'contact_phone',
      title: 'Contact Number',
      sortable: true,
      filterable: true,
    },
  ]

  const fetchAds = useCallback(async (): Promise<{ data: AdsTableRow[]; totalItems: number }> => {
    const latestAds = (ads ?? []) as AdsTableRow[]
    return {
      data: latestAds,
      totalItems: latestAds.length,
    }
  }, [ads])

  const handleEdit = (row: AdsTableRow) => {
    router.push(`/ads/edit/${row.id}`)
  }

  const handleDelete = async (row: AdsTableRow) => {
    try {
      const response = await onDeleteAd(row.id as string)
      
      if (response.error) {
        toast.error(response.message || 'Failed to delete ad')
        return
      }

      toast.success('Ad deleted successfully')
      mutateAds() // Refresh the ads list
    } catch (error) {
      console.error('Error deleting ad:', error)
      toast.error('An error occurred while deleting the ad')
    }
  }

  const actions = [
    {
      label: 'Edit',
      onClick: handleEdit,
      icon: Edit,
      color: '#3b82f6',
      title: 'Edit ad',
    },
    {
      label: 'Delete',
      onClick: handleDelete,
      icon: Trash2,
      color: '#ef4444',
      title: 'Delete ad',
    },
  ]

  // Calculate status data from actual ads
  const calculateStatusData = () => {
    const statusCount = {
      Available: 0,
      Sold: 0,
      Reserved: 0,
    }

    ads.forEach((ad) => {
      if (ad.status === 'AVAILABLE') statusCount.Available++
      else if (ad.status === 'SOLD') statusCount.Sold++
      else if (ad.status === 'RESERVED') statusCount.Reserved++
    })

    return [
      { name: 'Available', value: statusCount.Available },
      { name: 'Sold', value: statusCount.Sold },
      { name: 'Reserved', value: statusCount.Reserved },
    ]
  }

  // Calculate monthly data from actual ads
  const calculateMonthlyData = () => {
    const monthCounts: { [key: string]: number } = {}
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    ads.forEach((ad) => {
      const date = new Date(ad.created_at)
      const monthName = monthNames[date.getMonth()]
      monthCounts[monthName] = (monthCounts[monthName] || 0) + 1
    })

    return monthNames.map((month) => ({
      name: month,
      count: monthCounts[month] || 0,
    }))
  }

  const currentStatusData = ads.length > 0 ? calculateStatusData() : statusData
  const currentMonthlyData = ads.length > 0 ? calculateMonthlyData() : monthlyData

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Ads</h1>
          <p className="text-gray-500">Manage and oversee all listed ads.</p>
        </div>
        <Button
          type="button"
          onClick={() => router.push('/ads')}
          className="flex items-center gap-2 bg-[#7B1E1E] px-4 py-2 text-sm font-medium text-white rounded-md shadow-md hover:bg-[#641717] transition"
        >
          Add Ads
        </Button>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table Section */}
        <div className="col-span-2 bg-white rounded-xl shadow">
          <div className="p-4">
            <DataTable 
              columns={columns} 
              fetchData={fetchAds} 
              loading={isLoading}
              isPagination={false}
              pageSize={currentLimit}
              actions={actions}
            />
          </div>
          
          {/* Custom Server-Side Pagination */}
          <Pagination
            page={currentPage}
            setPage={setCurrentPage}
            totalPages={Math.ceil(total / currentLimit)}
            totalItems={total}
            currentPageSize={currentLimit}
            pageSizeOptions={[5, 10, 25, 50, 100]}
            handlePageSizeChange={(size) => {
              setCurrentLimit(size)
              setCurrentPage(1)
            }}
            isLoading={isLoading}
            dataLength={ads.length}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pie Chart */}
          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="font-semibold mb-4 text-gray-700">Ads by Status</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={currentStatusData} dataKey="value" nameKey="name" outerRadius={70} innerRadius={40}>
                  {currentStatusData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="font-semibold mb-4 text-gray-700">Ads Added Over Time</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={currentMonthlyData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="font-semibold mb-4 text-gray-700">Ad Statistics</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex justify-between">
                <span>Total Ads:</span>
                <span className="font-semibold">{total}</span>
              </li>
              <li className="flex justify-between">
                <span>Published:</span>
                <span className="font-semibold">{ads.filter((ad) => ad.is_published).length}</span>
              </li>
              <li className="flex justify-between">
                <span>Boosted:</span>
                <span className="font-semibold">{ads.filter((ad) => ad.is_boosted).length}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
