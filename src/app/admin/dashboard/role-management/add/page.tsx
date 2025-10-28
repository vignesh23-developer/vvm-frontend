'use client'

import { useRouter } from 'next/navigation'
import RoleManagementForm from '@/components/admin/forms/RoleManagementForm'
import { appEndpoints } from '@/services/endpoints'
import { postMethod } from '@/services/service'
import { toast } from 'react-hot-toast/headless'

interface FormValues {
  name: string
  description: string
}

export default function AddRoleManagement() {
  const router = useRouter()

  const initialValues: FormValues = {
    name: '',
    description: '',
  }

  const handleSubmit = async (values: FormValues) => {
    try {
      const payload = {
        name: values.name.trim(),
        description: values.description?.trim(),
      }

      const response = await postMethod(appEndpoints.createRole, payload)

      if (response.data.error) {
        toast.error(response.data.message || 'Failed to create role')
        return
      }

      toast.success('Role created successfully!')

      router.push('/admin/dashboard/role-management')
    } catch (error: any) {
      console.error('Create failed:', error)
      toast.error(error?.message || 'Something went wrong!')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Form Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">Add Role</h2>

        <RoleManagementForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          submitLabel="Create Role"
          isEdit={false}
        />
      </div>
    </div>
  )
}
