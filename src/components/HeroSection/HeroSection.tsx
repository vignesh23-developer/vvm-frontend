'use client'
import { Search, MapPin, Home, ChevronDown, IndianRupee } from 'lucide-react'

const HeroSection = () => {
  return (
    <main
      className="relative h-screen w-full bg-cover bg-center"
      style={{ backgroundImage: "url('/hero_section.png')" }} // 👈 place image in /public
    >
      {/* Overlay card */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="rounded-3xl bg-black/60 px-8 py-10 text-center text-white max-w-4xl w-full mx-4">
          <h1 className="text-3xl font-bold mb-6">
            Welcome back! Choose Premium House
          </h1>

          {/* Tabs */}
          <div className="flex justify-center space-x-8 mb-8 text-lg font-medium">
            <button className="text-yellow-400 border-b-2 border-yellow-400 pb-1">
              Buy
            </button>
            <button className="hover:text-yellow-400">Rent</button>
            <button className="hover:text-yellow-400">New Projects</button>
            <button className="hover:text-yellow-400">PG</button>
            <button className="hover:text-yellow-400">Plots</button>
            <button className="hover:text-yellow-400">Commercial</button>
          </div>

          {/* Search Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white text-black rounded-2xl px-4 py-3 shadow-lg">
            {/* Location */}
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-black" />
              <span className="font-medium">Chennai</span>
              <span className="text-gray-500">Add more...</span>
            </div>

            {/* Flat */}
            <div className="flex items-center space-x-2">
              <Home className="w-5 h-5 text-black" />
              <span className="font-medium">Flat +1</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>

            {/* Budget */}
            <div className="flex items-center space-x-2">
              <IndianRupee className="w-5 h-5 text-black" />
              <span className="font-medium">Budget</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>

            {/* Search Button */}
            <button className="flex items-center space-x-2 bg-black text-white px-6 py-2 rounded-xl hover:bg-gray-800 transition">
              <Search className="w-5 h-5" />
              <span>Search</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

export default HeroSection
