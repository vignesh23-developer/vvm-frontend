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
  scrollable?: boolean
  /** Extra classes on the fullscreen backdrop (e.g. safe-area padding) */
  overlayClassName?: string
  /** Extra classes on the white panel (responsive width/padding) */
  panelClassName?: string
  /** Extra classes on the scrollable content wrapper */
  contentClassName?: string
}

export default function Modal({
  open,
  title,
  onClose,
  children,
  footer,
  widthClass = 'max-w-lg',
  scrollable = false,
  overlayClassName = '',
  panelClassName = '',
  contentClassName = '',
}: ModalProps) {
  if (!open) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 pt-[max(0.75rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:p-6 ${overlayClassName}`}
    >
      <div
        className={`relative w-[calc(100%-0.5rem)] max-w-full sm:w-full ${widthClass} max-h-[min(90dvh,calc(100vh-1.5rem))] flex flex-col rounded-lg bg-white p-4 shadow-lg sm:p-6 ${panelClassName}`}
      >
        {/* Header */}
        <div className="mb-3 flex shrink-0 items-start justify-between gap-2 sm:mb-4">
          {title && <h2 className="text-lg font-semibold pr-2">{title}</h2>}
          <Button onClick={onClose} className="rounded p-1.5 text-gray-500 hover:bg-gray-100 shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label="Close">
            <X size={18} />
          </Button>
        </div>

        {/* Content */}
        <div
          className={`min-h-0 min-w-0 flex-1 ${scrollable ? 'max-h-[min(75dvh,70vh)] overflow-y-auto overflow-x-hidden' : ''} ${contentClassName}`}
        >
          {children}
        </div>

        {/* Footer */}
        {footer && <div className="mt-4 flex shrink-0 justify-end gap-2 border-t pt-3">{footer}</div>}
      </div>
    </div>
  )
}
