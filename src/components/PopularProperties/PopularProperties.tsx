import { MapPin, BedSingle, Ruler, IndianRupee } from 'lucide-react'

export default function PopularProperties() {
  const items = [
    {
      title: 'Avenue 1, Ashok Nagar',
      rooms: 4,
      area: '3,500 sq ft',
      price: '₹50,000',
      image: '/pp1.png',
    },
    {
      title: 'Avenue 2, Vadapalani',
      rooms: 3,
      area: '1,500 sq ft',
      price: '₹50,000',
      image: '/pp2.png',
    },
    {
      title: 'Avenue 3, Anna Nagar',
      rooms: 3,
      area: '1,500 sq ft',
      price: '₹50,000',
      image: '/pp3.png',
    },
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Heading */}
        <h2 className="text-3xl lg:text-5xl font-bold text-gray-900">
          Our Popular Properties
        </h2>
        <p className="mt-3 text-gray-600 text-lg max-w-2xl mx-auto">
          Discover premium homes with modern amenities and prime locations.
        </p>

        {/* Property grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {items.map((p, idx) => (
            <div
              key={idx}
              className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300"
            >
              {/* Image */}
              <img
                src={p.image}
                alt={p.title}
                className="w-full h-80 object-cover rounded-t-2xl"
              />

              {/* Content */}
              <div className="p-6 bg-[#D9D9D9]">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-3">
                  <MapPin size={18} className="text-gray-600" />
                  {p.title}
                </h3>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-6">
                  <span className="flex items-center gap-1">
                    <BedSingle size={18} className="text-gray-500" />
                    {p.rooms} Rooms
                  </span>
                  <span className="flex items-center gap-1">
                    <Ruler size={18} className="text-gray-500" />
                    {p.area}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition">
                    See More
                  </button>
                  <p className="flex items-center gap-1 font-bold text-lg text-gray-800">
                    <IndianRupee size={18} className="text-gray-700" />
                    {p.price.replace('₹', '')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
