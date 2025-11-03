'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getLocalStorageItem } from '@/utils/local_storage/local_storage_handler'
import HomePageLayout from '@/app/(buyer)/(site)/layout'
import HomePage from '@/app/(buyer)/(site)/home/page'

export default function Home() {
  const router = useRouter()
  const authToken = getLocalStorageItem('authToken')
  useEffect(() => {
    if (!authToken) {
      router.push('/login')
    }
  }, [router])
  return <HomePageLayout children={<HomePage />} />
}
