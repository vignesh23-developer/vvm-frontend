// 'use client'

// import { Trash2, Edit3, Plus } from 'lucide-react'
// import useSWR, { mutate } from 'swr'
// import { useRouter } from 'next/navigation'
// import { useCallback, useMemo } from 'react'
// import Table from '@/components/ui/CustomComponent/Table/Table'
// import { appEnpoints } from '@/services/endpoints'
// import { getMethod } from '@/services/service'

// interface FeatureCategory {
//   id: number
//   code?: string
//   name: string
//   input_type?: string
//   filterable?: boolean
//   mandatory?: boolean
//   sort_order?: number
//   is_active?: boolean
// }

// export default function PropertyCategoryPage() {
//   const router = useRouter()

//   const fetcher = async (url: string) => {
//     const res = await getMethod<any>(url)
//     // Adjust this line to use the correct property from ResponseDTO, e.g., 'result' or 'payload'
//     return res.payload as FeatureCategory[]
//   }
//   const {
//     data: categories,
//     error,
//     isLoading,
//   } = useSWR<FeatureCategory[]>(appEnpoints.getAllFeatureCategories, fetcher)
//   const data = categories ?? []

//   const handleAdd = useCallback(
//     () => router.push('/admin/dashboard/feature-category/add'),
//     [router],
//   )
//   const handleEdit = useCallback(
//     (id: number) => router.push(`/admin/dashboard/feature-category/edit/${id}`),
//     [router],
//   )
//   const handleDelete = useCallback(async (id: number) => {
//     if (!confirm('Are you sure you want to delete this category?')) return
//     try {
//       await fetch(`${appEnpoints.deleteFeatureCategory}/${id}`, {
//         method: 'DELETE',
//       })
//       mutate(appEnpoints.getAllFeatureCategories)
//     } catch (err) {
//       console.error('Delete failed:', err)
//     }
//   }, [])
//   const handleRefresh = useCallback(
//     () => mutate(appEnpoints.getAllFeatureCategories),
//     [],
//   )

//   const columns = useMemo(
//     () => [
//       { key: 'icon', header: 'Icon' },
//       { key: 'code', header: 'Code' },
//       { key: 'name', header: 'Property Category' },
//       {
//         key: 'is_active',
//         header: 'Status',
//         render: (row: FeatureCategory) => (
//           <span
//             className={`px-3 py-1 rounded-full text-xs font-medium ${
//               row.is_active
//                 ? 'bg-green-100 text-green-700'
//                 : 'bg-red-100 text-red-600'
//             }`}
//           >
//             {row.is_active ? 'Active' : 'Inactive'}
//           </span>
//         ),
//       },
//       {
//         key: 'actions',
//         header: 'Actions',
//         render: (row: FeatureCategory) => (
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => handleEdit(row.id)}
//               className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition"
//               aria-label={`Edit ${row.name}`}
//             >
//               <Edit3 size={16} />
//             </button>
//             <button
//               onClick={() => handleDelete(row.id)}
//               className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition"
//               aria-label={`Delete ${row.name}`}
//             >
//               <Trash2 size={16} />
//             </button>
//           </div>
//         ),
//       },
//     ],
//     [handleEdit, handleDelete],
//   )

//   if (error)
//     return (
//       <div className="p-6 text-red-600">Failed to load feature categories.</div>
//     )
//   if (isLoading)
//     return (
//       <div className="p-6 text-gray-600 animate-pulse">
//         Loading feature categories...
//       </div>
//     )

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       {/* ✅ Breadcrumb */}
//       <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
//         <span>Dashboard</span>
//         <span className="text-gray-400">›</span>
//         <span className="font-medium text-gray-700">
//           Feature Category Master
//         </span>
//       </nav>

//       {/* ✅ Page Header */}
//       <div className="flex flex-wrap items-center justify-between mb-6">
//         <h1 className="text-xl font-semibold text-gray-800">
//           Feature Categories
//         </h1>
//         <div className="flex items-center gap-3">
//           <button
//             onClick={handleAdd}
//             className="flex items-center gap-2 bg-[#7B1E1E] hover:bg-[#641717] cursor-pointer text-white px-4 py-2 rounded-md text-sm font-medium shadow-md transition"
//             aria-label="Add category"
//           >
//             <Plus size={16} /> Add Category
//           </button>
//         </div>
//       </div>

//       {/* ✅ Table Card */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
//         <Table<FeatureCategory> columns={columns} data={data} />
//       </div>
//     </div>
//   )
// }
