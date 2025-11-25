import Link from 'next/link'
import Image from 'next/image'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-white px-4 py-2">
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center rounded-[32px] border border-[#b48a5a]/20 bg-[#fff9f2] px-8 py-8 text-center shadow-[0_25px_90px_rgba(85,51,17,0.15)]">
        <div className="mb-6 rounded-3xl border border-[#d5b48c]/40 bg-yellow-900 p-6 shadow-inner">
          <Image src="/footer_logo.png" alt="404 Not Found Vaazhga-valamudan" width={200} height={200} className="mx-auto opacity-95" />
        </div>

        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-[#8b5e34]">404 · Page Not Found</p>

          <h1 className="mt-2 text-4xl font-bold text-[#3b2a16] sm:text-5xl">Oops! Page not found.</h1>

          <p className="mt-4 text-base text-[#5f4223] mx-auto max-w-md">
            The page you are looking for doesn't exist or may have been moved. Please check the URL or go back to the homepage.
          </p>
        </div>

        <div className="mt-8 flex w-full flex-col gap-4 sm:flex-row">
          <Link
            href="/"
            className="flex-1 rounded-2xl bg-[#8b5e34] px-6 py-3 text-base font-medium text-white shadow-lg shadow-[#8b5e34]/30 transition hover:-translate-y-0.5 hover:bg-[#a47142] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8b5e34] focus-visible:ring-offset-2"
          >
            Go to homepage
          </Link>
        </div>
      </div>
    </main>
  )
}
