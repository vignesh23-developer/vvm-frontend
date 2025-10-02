'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useTranslations } from 'next-intl'

const OtpVerification = () => {
  const t = useTranslations('Auth')
  const [otp, setOtp] = useState(['', '', '', ''])

  const handleChange = (value: string, index: number) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)

      // Auto move to next input
      if (value && index < 3) {
        const nextInput = document.getElementById(`otp-${index + 1}`)
        nextInput?.focus()
      }
    }
  }
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Logo Section */}
      <div className="hidden md:flex w-1/2 bg-[#2c1207] flex-col items-center justify-center text-center p-6">
        <Link href="/home">
          <div className="max-w-xs hover:cursor-pointer">
            <Image
              src="/footer_logo.png"
              alt="Vaazhga Valamudan Logo"
              width={400}
              height={300}
              className="mt-6 hover:scale-105 transition"
            />
          </div>
        </Link>
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-full md:w-1/2 flex items-start justify-center p-20">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <Link
            href="/forgot-password"
            className="flex items-center text-sm font-semibold text-green-900 mb-2 hover:underline"
          >
            <ArrowLeft size={20} className="mr-2" /> {t('back')}
          </Link>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-800 leading-snug">
            {t('otp_verification')}
          </h2>
          <p className="text-gray-500 mt-2 text-xs">{t('otp_description')}</p>

          {/* OTP Inputs */}
          <div className="flex justify-between mt-4 mb-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={e => handleChange(e.target.value, index)}
                className="w-14 h-14 text-center text-xl font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-900"
              />
            ))}
          </div>

          {/* Verify Button */}
          <button
            type="button"
            className="w-full bg-[#2B1B12] text-white text-sm py-2 rounded-md font-medium hover:bg-[#3d2616]"
          >
            {t('verify')}
          </button>

          {/* Resend Link */}
          <p className="text-right mt-4 text-xs text-gray-600 hover:underline cursor-pointer">
            {t('resend_otp')}
          </p>
        </div>
      </div>
    </div>
  )
}

export default OtpVerification
