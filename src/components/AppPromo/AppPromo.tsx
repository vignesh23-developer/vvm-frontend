// components/AppPromo.tsx
import Image from 'next/image'

export default function AppPromo() {
  return (
    <section className="w-full bg-gradient-to-r from-[#ECF1F8] to-[#D9D9D9] py-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
        {/* Left content */}
        <div className="space-y-8">
          <h2 className="text-3xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
            Check out our app too, <br /> don’t miss it!
          </h2>
          <p className="text-gray-600 max-w-xl">
            Lorem ipsum <span className="font-semibold">dolor sit amet</span>,
            consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
            labore et{' '}
            <span className="font-semibold">dolore magna aliqua.</span>
          </p>

          {/* Store buttons */}
          <div className="flex flex-wrap gap-4">
            <Image
              src="/googleplay.png"
              alt="Get it on Google Play"
              width={160}
              height={48}
              className="cursor-pointer drop-shadow-sm hover:scale-105 transition-transform"
            />
            <Image
              src="/appstore.png"
              alt="Download on the App Store"
              width={160}
              height={48}
              className="cursor-pointer drop-shadow-sm hover:scale-105 transition-transform"
            />
          </div>

          {/* Subscription */}
          <div className="space-y-3">
            <p className="text-gray-700 font-medium">
              Don’t lose it when it comes out!
            </p>
            <form className="flex max-w-md rounded-md overflow-hidden border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500">
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-4 py-3 text-gray-700 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-gray-900 text-white px-6 hover:bg-gray-800 transition"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Right content - Phone mockups */}
        <div className="flex justify-center relative">
          {/* Back phone */}
          {/* <div className="absolute top-6 left-12 w-44 h-96 transform -rotate-6 shadow-xl hidden lg:block">
            <Image
              src="/Frame-545.png"
              alt="Phone mockup back"
              fill
              className="object-contain"
            />
          </div> */}

          {/* Front phone */}
          {/* <div className="relative w-52 h-[28rem] shadow-2xl">
            <Image
              src="/Frame-546.png"
              alt="Phone mockup front"
              fill
              className="object-contain"
            />
          </div> */}
        </div>
      </div>
    </section>
  )
}
