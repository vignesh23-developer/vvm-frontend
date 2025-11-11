'use client'
import HomePageLayout from '@/app/(buyer)/(site)/layout'
import HomePage from '@/app/(buyer)/(site)/home/page'

export default function Home() {
  return <HomePageLayout children={<HomePage />} />
}
