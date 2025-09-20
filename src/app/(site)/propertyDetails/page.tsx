'use client'

import Image from 'next/image'
import { Heart, Share2, BedDouble, Bath, Building, Sofa } from 'lucide-react'
import Amenities from '../../../components/Amenities/Amenities'

const page = () => {
  return (
    <main className="w-full bg-gray-50 py-8 px-4 md:px-10">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
        {/* Left Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Property Card */}
          <div className="bg-white shadow-md rounded-xl overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-start p-5">
              <div>
                <h2 className="text-xl font-semibold">₹ 9.10 Cr</h2>
                <p className="text-sm text-gray-500">₹19,465 per sqft</p>
                <p className="text-gray-800 mt-2 font-medium">
                  4 BHK Villa for Sale in Whitefield Chennai
                </p>
              </div>
              <div className="flex gap-3">
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <Heart size={20} />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <Share2 size={20} />
                </button>
              </div>
            </div>

            {/* Image Carousel */}
            <div className="relative w-full h-60 flex gap-3 px-5">
              {/* Main Image */}
              <div className="relative flex-1 rounded-xl overflow-hidden">
                <Image
                  src="/images/property-main.jpg"
                  alt="Property"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Side Image with +25 Photos */}
              <div className="relative w-40 rounded-xl overflow-hidden">
                <Image
                  src="/images/property-inside.jpg"
                  alt="Interior"
                  fill
                  className="object-cover"
                />
                <span className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-medium text-sm">
                  +25 Photos
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between mt-4 bg-gray-100 rounded-lg p-2 text-sm">
              <div className="flex items-center gap-2 px-3 border-r border-gray-300 last:border-r-0">
                <BedDouble className="w-4 h-4" />
                <span>3 Beds Rooms</span>
              </div>
              <div className="flex items-center gap-2 px-3 border-r border-gray-300 last:border-r-0">
                <Bath className="w-4 h-4" />
                <span>3 Bathrooms</span>
              </div>
              <div className="flex items-center gap-2 px-3 border-r border-gray-300 last:border-r-0">
                <Building className="w-4 h-4" />
                <span>1 Balcony</span>
              </div>
              <div className="flex items-center gap-2 px-3">
                <Sofa className="w-4 h-4" />
                <span>Semi Furnished</span>
              </div>
            </div>

            {/* Details */}
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 p-6 text-sm">
              <div>
                <p className="text-gray-600">Super Built-up Area</p>
                <p className="font-semibold">2000sqft</p>
              </div>
              <div>
                <p className="text-gray-600">Floors</p>
                <p className="font-semibold">Ground (Out of 3 Floors)</p>
              </div>
              <div>
                <p className="text-gray-600">Parking</p>
                <p className="font-semibold">Bike and Car</p>
              </div>
              <div>
                <p className="text-gray-600">Age of Building</p>
                <p className="font-semibold">&gt;10 years</p>
              </div>
              <div>
                <p className="text-gray-600">Price</p>
                <p className="font-semibold">₹ 9.10 Cr</p>
              </div>
              <div>
                <p className="text-gray-600">Booking Amount</p>
                <p className="font-semibold">₹ 80,000</p>
              </div>
              <div>
                <p className="text-gray-600">Address</p>
                <p className="font-semibold">Chennai, Guindy</p>
              </div>
              <div>
                <p className="text-gray-600">Gated Security</p>
                <p className="font-semibold">Yes</p>
              </div>
            </div>
            {/* Description */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold mb-3">Description</h2>
              <p className="text-gray-700 leading-relaxed text-justify text-sm">
                Spacious 4 BHK Villa for Sale in Whitefield, Chennai
                <br />
                <br />
                This semi-furnished villa offers a super built-up area of 2000
                sq.ft with 3 bedrooms, 3 bathrooms, and 1 balcony. Located on
                the ground floor of a 3-floor building, it comes with bike and
                car parking, gated security, and modern amenities. Situated in
                Guindy, Chennai, this property is over 10 years old and priced
                at ₹9.10 Cr with a booking amount of ₹80,000.
              </p>
            </div>
          </div>

          {/* Amenities */}
          <Amenities />

          {/* Video Section */}
          <div className="bg-white shadow-md rounded-xl">
            <iframe
              className="w-full h-64 rounded-lg"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Property Video"
              allowFullScreen
            ></iframe>
          </div>

          {/* Map Section */}
          <div className="bg-white shadow-md rounded-xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.919802768646!2d80.22096687507835!3d12.917747717126711!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a525f5f6c4e8a67%3A0x3db9b4e2d79c7c5c!2sChennai!5e0!3m2!1sen!2sin!4v1675092345678"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              className="rounded-lg"
            ></iframe>
          </div>
        </div>

        {/* Right Sidebar */}
        <aside className="space-y-6">
          {/* Contact Owner */}
          <div className="bg-white shadow-md rounded-xl p-6">
            <h3 className="text-lg font-bold mb-2">Contact Owner</h3>
            <p className="text-gray-700 font-medium">Name: Shankar</p>
            <p className="text-gray-700 mb-4">+91 1234567890</p>
            <button className="w-full bg-[#3A2A20] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#241810] transition">
              Contact Owner
            </button>
          </div>

          {/* Agents */}
          <div className="bg-white shadow-md rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                SD
              </div>
              <p className="font-medium text-gray-700">Agent 1</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
                S
              </div>
              <p className="font-medium text-gray-700">Agent 2</p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}

export default page
