'use client'

import { useEffect, useState, useCallback } from 'react'
import ChangePassword from '@/components/ui/ChangePassword/ChangePassword'
import { useRouter, useParams } from 'next/navigation'
import { appEndpoints } from '@/services/endpoints'
import { getMethod, postMethod } from '@/services/service'
import ProfileForm from '../(forms)/ProfileForm'
import { ProfileValidationSchema } from '../(validation)/ProfileValidation'
import { useAuth } from '@/hooks/AuthContext/AuthContextProvider'
import KYCStatus from '@/components/kyc/KYCStatus'
import { ResponseDTO } from '@/components/dto/response_dto'
import toast from 'react-hot-toast'
import CustomLoader from '@/components/ui/CustomComponent/Loader/CustomLoader'
import WalletCard from '@/components/buyer/Wallet/WalletCard'
import { Roles, getUserRoles, hasRole } from '@/utils/roles/roles'
import { Building2 } from 'lucide-react'
import Link from 'next/link'

const ProfilePage = () => {
  const { id } = useParams()
  const router = useRouter()
  const { token, user } = useAuth()

  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [initialValues, setInitialValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  })

  // User roles
  const userRoles = getUserRoles(user)
  const isAdmin = hasRole(userRoles, [Roles.ADMIN])
  const isAgent = hasRole(userRoles, [Roles.AGENT])
  const isBuyer = hasRole(userRoles, [Roles.BUYER]) && !isAgent && !isAdmin

  // Show KYC only for buyers and unverified agents
  const showKYC = isBuyer || (isAgent && !user?.isKycVerified)

  // Redirect if no token
  useEffect(() => {
    if (!token) router.push('/login')
  }, [token, router])

  // Fetch user profile
  const fetchUserProfile = useCallback(async () => {
    try {
      setLoading(true)
      const response: ResponseDTO = await getMethod(appEndpoints.getUserProfile)

      const payload = response?.data ?? {}
      const { firstName, lastName, email, phoneNumber, profilePicture } = payload

      setImageUrl(profilePicture || null)
      setInitialValues({ firstName, lastName, email, phoneNumber })
    } catch (error) {
      console.error('Failed to fetch user profile:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUserProfile()
  }, [id, fetchUserProfile])

  // Upload profile image
  const handleProfileImageSubmit = async (file: File, resetForm: () => void) => {
    if (!file) {
      toast.error('Please select an image before submitting.')
      return
    }

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response: ResponseDTO = await postMethod(appEndpoints.uploadUserProfileImage, formData)

      if (Number(response?.status) === 201) {
        setImageUrl(response?.data?.profilePicture || null)
        toast.success('Profile image uploaded successfully!')

        resetForm()
        fetchUserProfile()
      } else {
        toast.error(response?.message || 'Upload failed. Try again.')
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload image. Please try again.')
    }
  }

  if (loading) {
    return <CustomLoader text="Loading profile..." />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf5eb] via-white to-[#fef9f0]">
      <div className="mx-auto max-w-6xl px-4 py-8">

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#2a1407]">Account Settings</h1>
          <p className="text-sm text-[#7a4a1d] mt-1">Manage your profile, security and preferences</p>
        </div>

        {/* Main Grid - 2/3 + 1/3 Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT COLUMN - Profile & Security (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            {loading ? (
              <div className="flex h-64 items-center justify-center rounded-2xl border border-[#e8d5c4] bg-white">
                <span className="text-[#7a4a1d]">Loading profile data...</span>
              </div>
            ) : (
              <>
                {/* Profile Form */}
                <ProfileForm
                  initialValues={initialValues}
                  validationSchema={ProfileValidationSchema}
                  isEdit={!!id}
                  profileImageUrl={imageUrl || undefined}
                  onImageUpload={handleProfileImageSubmit}
                />

                {/* Change Password */}
                <ChangePassword />
              </>
            )}
          </div>

          {/* RIGHT COLUMN - KYC & Wallet (1/3 width) */}
          <div className="space-y-6">
            {/* KYC - Only show for buyers and unverified agents */}
            {showKYC && <KYCStatus />}

            {/* Wallet */}
            <WalletCard />

            {/* Become Agent CTA - Only for Buyers */}
            {isBuyer && (

              <div className="bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 rounded-2xl border border-yellow-200/60 p-6 relative overflow-hidden">
                {/* Decorative */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-yellow-200/40 rounded-full blur-2xl"></div>

                <div className="relative">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4 border border-yellow-200/50">
                    <Building2 className="w-6 h-6 text-yellow-600" />
                  </div>
                  <h3 className="text-base font-bold text-[#2a1407] mb-2">Become an Agent</h3>
                  <p className="text-xs text-[#7a4a1d] mb-4 leading-relaxed">
                    Start listing properties and grow your real estate business with VaazhgaValamudan.
                  </p>
                  <Link
                    href="/properties-registration"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-[#2a1407] font-bold text-sm rounded-xl hover:shadow-lg hover:shadow-yellow-400/30 transition-all"
                  >
                    <span className="text-lg">+</span>
                    Post Your First Property
                  </Link>
                </div>
              </div>
            )}


          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage