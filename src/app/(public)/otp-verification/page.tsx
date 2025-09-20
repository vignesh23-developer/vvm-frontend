'use client'

import { useState } from 'react'
import CustomImage from '@/components/CustomImage/CustomImage'
import Link from 'next/link'
// import { FaWhatsapp } from "react-icons/fa";

const OtpVerification = () => {
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
        <div className="max-w-xs">
          <CustomImage
            src="/footer_logo.png"
            alt="Vaazhga Valamudan Logo"
            width={300}
            height={300}
            className="mx-auto"
          />
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <Link
            href="/forget-password"
            className="flex items-center text-sm font-semibold text-green-900 mb-6 hover:underline"
          >
            {/* <FaArrowLeft className="mr-2" /> Back */}
          </Link>

          {/* Title */}
          <h2 className="text-3xl font-bold text-gray-800 leading-snug">
            Verify Your <br /> OTP
          </h2>
          <p className="text-gray-500 mt-2 text-sm">
            Check your SMS for the 4-digit code.
          </p>

          {/* OTP Inputs */}
          <div className="flex justify-between mt-8 mb-6">
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
            className="w-full bg-[#2B1B12] text-white py-2 rounded-md font-medium hover:bg-[#3d2616]"
          >
            Verify
          </button>

          {/* Resend Link */}
          <p className="text-right mt-4 text-sm text-gray-600 hover:underline cursor-pointer">
            Resend OTP
          </p>
        </div>
      </div>
    </div>
  )
}

export default OtpVerification
