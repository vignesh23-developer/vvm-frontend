'use client'

import { Component, type ErrorInfo, type ReactNode } from 'react'
import { toast } from 'react-hot-toast'
import Button from '../ui/CustomComponent/Button/Button'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Global error boundary caught an error', error, errorInfo)
    toast.error('Something went wrong. Please try again.', { id: 'global-error-boundary' })
    if (typeof reportError === 'function') {
      reportError({ error, componentStack: errorInfo.componentStack })
    }
  }

  private resetBoundary = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-6 py-12">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white shadow-xl shadow-yellow-100/70 p-8 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-50 text-yellow-700">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <circle cx="12" cy="16" r="1" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">We hit a snag</h1>
            <p className="mt-2 text-sm text-gray-600">
              Something unexpected happened while loading this view. You can try reloading the section or refresh the entire page.
            </p>
            {this.state.error && (
              <p className="mt-3 text-xs text-gray-400 line-clamp-2" title={this.state.error.message}>
                {this.state.error.message}
              </p>
            )}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button
                type="button"
                onClick={this.resetBoundary}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-yellow-600 text-white text-sm font-medium hover:bg-yellow-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-yellow-500"
              >
                Reload section
              </Button>
              <Button
                type="button"
                onClick={() => window.location.reload()}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Refresh page
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
