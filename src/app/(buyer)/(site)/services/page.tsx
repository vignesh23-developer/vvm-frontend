'use client'

import Image from 'next/image'

const service = () => {
  const properties = [
    { id: 1, title: '3BHK', owner: 'Shankar', image: '/property1.png' },
    { id: 2, title: '3BHK', owner: 'Shankar', image: '/property2.png' },
    { id: 3, title: '3BHK', owner: 'Shankar', image: '/property3.png' },
    { id: 4, title: '3BHK', owner: 'Shankar', image: '/property1.png' },
    { id: 5, title: '3BHK', owner: 'Shankar', image: '/property3.png' },
    { id: 6, title: '3BHK', owner: 'Shankar', image: '/property2.png' },
  ]
  return (
    <main className="w-full bg-gray-50">
      {/* Hero Section */}
      <section className="relative w-full h-[400px] flex items-center justify-center">
        <Image
          src="/property1.png"
          alt="Our Services"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <h1 className="relative text-5xl font-bold text-white z-10">
          Our Services
        </h1>
      </section>

      {/* Search Section */}
      <section className="max-w-6xl mx-auto py-12 px-6 flex flex-col md:flex-row gap-6 justify-center">
        <button className="w-full md:w-auto border-2 border-gray-800 px-8 py-3 rounded-md text-lg font-medium hover:bg-gray-100 transition">
          Search Properties
        </button>
        <button className="w-full md:w-auto border-2 border-gray-800 px-8 py-3 rounded-md text-lg font-medium hover:bg-gray-100 transition">
          Search Location
        </button>
      </section>

      {/* Properties Grid */}
      <section className="max-w-6xl mx-auto px-6 py-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {properties.map(property => (
          <div
            key={property.id}
            className="bg-white rounded-2xl shadow-md overflow-hidden"
          >
            <div className="relative w-full h-52">
              <Image
                src={property.image}
                alt={property.title}
                fill
                className="object-cover"
              />
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="black"
                    viewBox="0 0 24 24"
                    stroke="black"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M5.25 5.653v12.693c0 .593.662.95 1.155.632l10.518-6.347a.75.75 0 000-1.264L6.405 5.021a.75.75 0 00-1.155.632z"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold">{property.title}</h3>
              <p className="text-gray-600 text-sm">Owner: {property.owner}</p>
            </div>
          </div>
        ))}
      </section>
    </main>
  )
}

export default service
