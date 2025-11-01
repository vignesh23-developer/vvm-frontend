'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { appEndpoints } from '@/services/endpoints'
import { getMethod, patchMethod } from '@/services/service'
import RoleManagementForm, { FormValues } from '@/components/admin/forms/RoleManagementForm'
import toast from 'react-hot-toast'
import PropertyCategoryForm from '@/app/admin/dashboard/(master)/property-category/(forms)/PropertyCategoryForm'

export default function EditRoleManagement() {
  const router = useRouter()
  const params = useParams()
  const { id } = params

  const [initialValues, setInitialValues] = useState<FormValues | null>(null)
  const [loading, setLoading] = useState(true)

  /** 🔹 Fetch existing role data */
  useEffect(() => {
    const fetchRole = async () => {
      try {
        const response = await getMethod(`${appEndpoints.getRoleByID(id as string)}`)
        if (response) {
          // normalize payload: some APIs wrap data in a `data` field or return the object directly
          const payload = (response as any).data ?? response
          const { name, description } = payload
          setInitialValues({
            name,
            description,
          })
        }
      } catch (error) {
        console.error('Failed to fetch role:', error)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchRole()
  }, [id])

  /** 🔹 Handle submit */
  const handleSubmit = async (values: FormValues) => {
    try {
      const payload = {
        ...values,
      }

      const response = await patchMethod(`${appEndpoints.updateRole(id as string)}`, payload)

      toast.success('Role updated successfully')
      router.push('/admin/dashboard/role-management')
    } catch (error: any) {
      console.error('Update failed:', error)
      toast.error(error.response?.data?.message || error.message || 'Something went wrong while updating role')
    }
  }

  /** 🔹 Loading / error states */
  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-600">Loading role details...</div>

  if (!initialValues) return <div className="min-h-screen flex items-center justify-center text-gray-500">Role not found.</div>

  /** ✅ Render Form */
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">Edit Role</h2>

        <RoleManagementForm initialValues={initialValues} onSubmit={handleSubmit} submitLabel="Update Role" isEdit={true} />
      </div>
    </div>
  )
}
