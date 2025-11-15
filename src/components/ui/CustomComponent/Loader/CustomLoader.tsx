'use client'

export default function CustomLoader({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#7B1E1E] mx-auto" />
        <p className="mt-4 text-gray-600">{text}</p>
      </div>
    </div>
  )
}
