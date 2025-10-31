'use client'

import { ReactNode } from 'react'
import { X } from 'lucide-react'
import Button from '../Button/Button'

interface ModalProps {
  open: boolean
  title?: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
  widthClass?: string
}

export default function Modal({
  open,
  title,
  onClose,
  children,
  footer,
  widthClass = 'max-w-lg',
}: ModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div
        className={`relative w-full ${widthClass} rounded-lg bg-white p-6 shadow-lg`}
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          {title && <h2 className="text-lg font-semibold">{title}</h2>}
          <Button
            onClick={onClose}
            className="rounded p-1 text-gray-500 hover:bg-gray-100"
          >
            <X size={18} />
          </Button>
        </div>

        {/* Content */}
        <div className="mb-4">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="mt-4 flex justify-end gap-2 border-t pt-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
