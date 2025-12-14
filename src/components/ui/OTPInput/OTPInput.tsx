'use client'

import React, { useRef, useState, useEffect } from 'react'
import Button from '../CustomComponent/Button/Button'
import { appEndpoints } from '@/services/endpoints'
import { postMethod } from '@/services/service'
import { ResponseDTO } from '@/components/dto/response_dto'
import toast from 'react-hot-toast'

type Props = {
  length?: number
  value: string[]
  onChange: (next: string[]) => void
  onComplete?: (value: string) => void
  idPrefix?: string
  inputClassName?: string
  // Resend handling
  showResend?: boolean
  initialTime?: number // seconds
  reSendData?: any
  // Validation error (optional) - can be string or array from Formik/Yup
  error?: string | string[] | null
}

export default function OTPInput({
  length = 6,
  value,
  onChange,
  onComplete,
  idPrefix = 'otp',
  inputClassName = '',
  showResend = true,
  initialTime = 120,
  reSendData,
  error = null,
}: Props) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([])
  const [timeLeft, setTimeLeft] = useState<number>(initialTime)
  const [isLoading, setIsLoading] = useState(false)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    if (timeLeft <= 0) return
    timerRef.current = window.setInterval(() => setTimeLeft(s => s - 1), 1000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [timeLeft])

  const resetTimer = (next = initialTime) => {
    setTimeLeft(next)
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  const focusInput = (idx: number) => {
    const el = inputsRef.current[idx]
    el?.focus()
    el?.select()
  }

  // Compute a single, user-friendly error message.
  const errorMessage = (() => {
    if (!error) return ''
    if (Array.isArray(error)) {
      // prefer the first non-empty message (per-digit), otherwise fall back to any present string
      const found = error.find(e => !!e && String(e).trim())
      return found ?? ''
    }
    return String(error || '')
  })()

  const handleChange = (v: string, idx: number) => {
    if (!/^[0-9]?$/.test(v)) return
    const next = [...value]
    next[idx] = v
    onChange(next)
    if (v && idx < length - 1) focusInput(idx + 1)
    const joined = next.join('')
    if (joined.length === length && !next.some(ch => ch === '')) {
      onComplete?.(joined)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    const key = e.key
    if (key === 'Backspace') {
      e.preventDefault()
      const next = [...value]
      if (next[idx]) {
        next[idx] = ''
        onChange(next)
      } else if (idx > 0) {
        next[idx - 1] = ''
        onChange(next)
        focusInput(idx - 1)
      }
      return
    }

    if (key === 'ArrowLeft' && idx > 0) {
      e.preventDefault()
      focusInput(idx - 1)
      return
    }
    if (key === 'ArrowRight' && idx < length - 1) {
      e.preventDefault()
      focusInput(idx + 1)
      return
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, startIdx: number) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text').replace(/\D/g, '')
    if (!text) return
    const chars = text.split('').slice(0, length - startIdx)
    const next = [...value]
    for (let i = 0; i < chars.length; i++) {
      next[startIdx + i] = chars[i]
    }
    onChange(next)
    const filled = next.join('')
    if (filled.length >= length && !next.some(ch => ch === '')) {
      onComplete?.(filled)
    } else {
      const focusPos = Math.min(startIdx + chars.length, length - 1)
      focusInput(focusPos)
    }
  }

  const handleResend = async () => {
    setIsLoading(true)
    const resendPayload = {
      phoneNumber: reSendData?.phoneNumber,
      otpTypes: reSendData?.otpTypes || 'SMS',
    }
    try {
      const response = (await postMethod(appEndpoints.loginSendOtp, resendPayload)) as ResponseDTO
      // console.log('Resend OTP response:', response)
      if (response.status === '200') {
        toast.success('OTP resent successfully')
      } else {
        toast.error(response.message || 'Failed to resend OTP')
      }
    } catch (err) {
      console.error('Resend OTP failed', err)
      toast.error('Failed to resend OTP')
    } finally {
      setIsLoading(false)
      resetTimer()
    }
  }

  return (
    <div>
      <div className="flex justify-between mb-4">
        {Array.from({ length }).map((_, index) => (
          <input
            key={index}
            id={`${idPrefix}-${index}`}
            ref={el => {
              inputsRef.current[index] = el
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={value[index] ?? ''}
            onChange={e => handleChange(e.target.value, index)}
            onKeyDown={e => handleKeyDown(e, index)}
            onPaste={e => handlePaste(e, index)}
            className={`w-14 h-14 text-center text-xl font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-900 ${inputClassName}`}
          />
        ))}
      </div>

      {/* Validation message from parent (Formik) - show only one message */}
      {errorMessage ? (
        <div className="text-left mt-1">
          <p className="text-red-600 text-sm">{errorMessage}</p>
        </div>
      ) : null}

      {showResend && (
        <div className="text-right text-xs mt-2">
          {timeLeft > 0 ? (
            <span className="text-gray-400">
              Resend in {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
            </span>
          ) : (
            <Button type="button" onClick={handleResend} className="text-green-700 hover:underline">
              {isLoading ? 'Resending...' : 'Resend OTP'}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
