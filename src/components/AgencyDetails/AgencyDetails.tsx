'use client'

import Image from 'next/image'
import Link from 'next/link'
import Stats from '../../components/Stats/Stats'

export default function AgencyDetails() {
  const stats = [
    { value: '40', label: 'Properties For Sale' },
    { value: '15', label: 'Properties For Rent' },
    { value: '2500', label: 'Deals Closed' },
  ]
  const propertiesForSale = [
    {
      id: 1,
      title: '2 BHK Flat',
      price: '₹45 Lac | 940sqft',
      location: 'Anna Nagar, Chennai',
      image: '/property1.png',
    },
    {
      id: 2,
      title: '3 BHK Flat',
      price: '₹70 Lac | 1500sqft',
      location: 'Ashok Nagar, Chennai',
      image: '/property2.png',
    },
    {
      id: 3,
      title: '2 BHK Flat',
      price: '₹50 Lac | 1000sqft',
      location: 'Vadapalani, Chennai',
      image: '/property3.png',
    },
  ]

  const propertiesForRent = [...propertiesForSale] // demo re-use

  return (
    <main className="w-full bg-gray-50 py-10 px-6 md:px-12">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Top Section */}
        {/* 🔹 Breadcrumb */}
        <nav className="text-sm text-gray-600 mb-6 flex items-center gap-2">
          <Link href="/home" className="text-[#3A2A20] hover:underline">
            Home
          </Link>
          <span>›</span>
          <span className="text-gray-500">Agency</span>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* 🔹 Agent Card */}
          <div className="lg:col-span-2 bg-white shadow-md rounded-xl overflow-hidden p-6 flex flex-col sm:flex-row gap-6">
            {/* Left: Big Image */}
            <div className="relative w-full sm:w-1/3 h-full rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src="/agency.png"
                alt="Agent Deal"
                fill
                className="object-cover"
              />
            </div>

            {/* Right: Details */}
            <div className="flex-1">
              <h2 className="text-xl font-bold">Shankar</h2>
              <p className="text-sm text-gray-600">RMS Realtors</p>
              <p className="text-sm text-gray-600 mb-6">
                <span className="font-semibold">Operating since:</span> 2008
              </p>

              {/* Stats */}

              <Stats stats={stats} />

              {/* Deals + Operates */}
              <p className="text-sm text-gray-700 mb-3">
                <span className="font-semibold">Deals in:</span> Rent/Lease,
                Pre-launch, Original Booking, Resale, Others
              </p>
              <p className="text-sm text-gray-700 mb-6">
                <span className="font-semibold">Operates in:</span> Kanakapura
                Road, RBI Layout, Doddakallasandra, Vajarahalli, Block 8th,
                Anjanapura, Block 4in Road
              </p>

              {/* Contact Button */}
              <button className="bg-[#3A2A20] text-white px-6 py-2 rounded-lg hover:bg-[#241810] transition">
                Contact Agent
              </button>
            </div>
          </div>

          {/* 🔹 Enquiry Form */}
          <div className="bg-white shadow-md rounded-xl p-6">
            <h3 className="text-lg font-bold">Enquiry Now</h3>
            <p className="text-sm text-gray-500 mb-4">
              Let’s Start the Conversation
            </p>

            <form className="space-y-4">
              <input
                type="text"
                placeholder="Eg : Shankar"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#3A2A20]"
              />
              <input
                type="email"
                placeholder="xyz@gmail.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#3A2A20]"
              />
              <input
                type="tel"
                placeholder="+91 81xxxxxxxx"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#3A2A20]"
              />
              <textarea
                placeholder="Message"
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#3A2A20]"
              ></textarea>
              <button
                type="submit"
                className="w-full bg-[#3A2A20] text-white px-6 py-2 rounded-lg hover:bg-[#241810] transition"
              >
                Submit
              </button>
            </form>
          </div>
        </div>

        {/* Properties For Sale */}
        <section className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-bold mb-6">Properties For Sale</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {propertiesForSale.map(property => (
              <div
                key={property.id}
                className="bg-gray-50 rounded-lg shadow hover:shadow-lg transition overflow-hidden"
              >
                <div className="relative w-full h-40">
                  <Image
                    src={property.image}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold">{property.title}</h3>
                  <p className="text-sm text-gray-600">{property.price}</p>
                  <p className="text-sm text-gray-500 mb-3">
                    {property.location}
                  </p>
                  <button className="bg-[#3A2A20] text-white px-4 py-2 text-sm rounded-lg hover:bg-[#241810] transition">
                    Contact Owner
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Properties For Rent */}
        <section className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-bold mb-6">Properties For Rent</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {propertiesForRent.map(property => (
              <div
                key={property.id}
                className="bg-gray-50 rounded-lg shadow hover:shadow-lg transition overflow-hidden"
              >
                <div className="relative w-full h-40">
                  <Image
                    src={property.image}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold">{property.title}</h3>
                  <p className="text-sm text-gray-600">{property.price}</p>
                  <p className="text-sm text-gray-500 mb-3">
                    {property.location}
                  </p>
                  <button className="bg-[#3A2A20] text-white px-4 py-2 text-sm rounded-lg hover:bg-[#241810] transition">
                    Contact Owner
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
