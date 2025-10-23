// 'use client'

// import { useEffect, useState } from 'react'
// import { useRouter, useParams } from 'next/navigation'
// import * as Yup from 'yup'
// import { appEnpoints } from '@/services/endpoints'
// import { getMethod } from '@/services/service'
// import FeatureCategoryForm from '@/components/admin/forms/FeatureCategoryForm'

// interface FeatureFormValues {
//   code: string
//   name: string
//   description: string
//   input_type?: string
//   filterable?: boolean
//   mandatory?: boolean
//   sort_order?: number
//   is_active?: boolean
// }

// export default function EditFeatureCategory() {
//   const router = useRouter()
//   const params = useParams()
//   const { id } = params

//   const [initialValues, setInitialValues] = useState<FeatureFormValues | null>(
//     null,
//   )
//   const [loading, setLoading] = useState(true)

//   /** ✅ Validation schema */
//   const validationSchema = Yup.object({
//     name: Yup.string()
//       .min(2, 'Name must be at least 2 characters')
//       .required('Property category name is required'),
//     code: Yup.string()
//       .min(2, 'Code must be at least 2 characters')
//       .required('Property category code is required'),
//   })

//   /** 🔹 Fetch existing category data */
//   useEffect(() => {
//     const fetchCategory = async () => {
//       try {
//         const response = await getMethod(
//           `${appEnpoints.getFeatureCategoryByID(id as string)}`,
//         )
//         if (response) {
//           const {
//             code,
//             name,
//             description,
//             input_type,
//             filterable,
//             mandatory,
//             sort_order,
//             is_active,
//           } = response
//           setInitialValues({
//             code,
//             name,
//             description,
//             input_type,
//             filterable,
//             mandatory,
//             sort_order,
//             is_active,
//           })
//         }
//       } catch (error) {
//         console.error('Failed to fetch property category:', error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     if (id) fetchCategory()
//   }, [id])

//   /** 🔹 Handle submit */
//   const handleSubmit = async (values: FeatureFormValues) => {
//     try {
//       await fetch(`${appEnpoints.updateFeatureCategory}/${id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(values),
//       })
//       router.push('/property-category')
//     } catch (error) {
//       console.error('Update failed:', error)
//     }
//   }

//   /** 🔹 Loading / error states */
//   if (loading)
//     return (
//       <div className="min-h-screen flex items-center justify-center text-gray-600">
//         Loading category details...
//       </div>
//     )

//   if (!initialValues)
//     return (
//       <div className="min-h-screen flex items-center justify-center text-gray-500">
//         Feature category not found.
//       </div>
//     )

//   /** ✅ Render Form */
//   return (
//     <div className="min-h-screen bg-gray-50 p-8">
//       <div className="text-sm text-gray-500 mb-6 flex items-center gap-2">
//         <span>Dashboard</span>
//         <span className="text-gray-400">›</span>
//         <span>Feature Category Master</span>
//         <span className="text-gray-400">›</span>
//         <span className="font-medium text-gray-700">Edit Feature Category</span>
//       </div>

//       <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 max-w-3xl mx-auto">
//         <h2 className="text-2xl font-semibold text-gray-900 mb-8">
//           Edit Feature Category
//         </h2>

//         <FeatureCategoryForm
//           initialValues={initialValues}
//           validationSchema={validationSchema}
//           onSubmit={handleSubmit}
//           submitLabel="Update Feature Category"
//           isEdit={true}
//         />
//       </div>
//     </div>
//   )
// }
