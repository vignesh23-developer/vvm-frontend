'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/AuthContext/AuthContextProvider'
import { useLoginModal } from '@/components/auth/LoginModalProvider'
import { getMethod } from '@/services/service'
import { appEndpoints } from '@/services/endpoints'
import { ResponseDTO } from '@/components/dto/response_dto'
import { motion } from 'framer-motion'
import { OAUTH_RETURN_NEXT_KEY } from '@/components/auth/LoginFormPanel'

const OAuthSuccess = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setToken, setUser } = useAuth()
  const { openLoginModal } = useLoginModal()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const hasProcessed = useRef(false)

  useEffect(() => {
    // Prevent multiple executions
    if (hasProcessed.current) {
      return
    }

    const handleOAuthSuccess = async () => {
      try {
        // Extract tokens from URL query params
        const accessToken = searchParams.get('accessToken')
        const refreshToken = searchParams.get('refreshToken')
        const next = searchParams.get('next')

        if (!accessToken) {
          setError('Access token not found')
          setIsLoading(false)
          return
        }

        // Mark as processed to prevent re-execution
        hasProcessed.current = true

        // Set token in cookies
        await setToken(accessToken)

        // Small delay to ensure token is set in cookies before API call
        await new Promise(resolve => setTimeout(resolve, 100))

        // Fetch user profile with the access token
        const response: ResponseDTO<any> = await getMethod(appEndpoints.getUserProfile)

        if (response.error || !response.data) {
          console.error('Failed to fetch user profile:', response)
          setError('Failed to fetch user profile')
          setIsLoading(false)
          hasProcessed.current = false // Allow retry on error
          return
        }

        // Set user data
        await setUser(response.data)

        // Small delay before redirect to ensure state is updated
        await new Promise(resolve => setTimeout(resolve, 100))

        let storedNext: string | null = null
        try {
          storedNext = sessionStorage.getItem(OAUTH_RETURN_NEXT_KEY)
          sessionStorage.removeItem(OAUTH_RETURN_NEXT_KEY)
        } catch {
          /* ignore */
        }
        const fromQuery = next && next.startsWith('/') ? next : null
        const fromStorage = storedNext && storedNext.startsWith('/') ? storedNext : null
        const redirectUrl = fromQuery ?? fromStorage ?? '/'
        router.push(redirectUrl)
      } catch (err) {
        console.error('OAuth success error:', err)
        setError('An error occurred during authentication')
        setIsLoading(false)
        hasProcessed.current = false // Allow retry on error
      }
    }

    handleOAuthSuccess()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty dependency array - only run once on mount

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            type="button"
            onClick={() => {
              router.replace('/')
              openLoginModal()
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Return to Login
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Completing Sign In...</h1>
        <p className="text-gray-600">Please wait while we set up your account</p>
      </motion.div>
    </div>
  )
}

export default OAuthSuccess

