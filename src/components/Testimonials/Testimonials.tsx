// components/Testimonials.tsx
import { Star } from 'lucide-react'

export default function Testimonials() {
  const feedback = [
    {
      client: 'Client number 1',
      text: 'One of the standout qualities of Ziken Labs is their commitment to understanding the subject matter before diving into content writing. This dedication to research and knowledge-building sets them apart in the content writing industry.',
      rating: 2,
    },
    {
      client: 'Client number 2',
      text: 'This dedication to research and knowledge-building sets them apart from the competition.',
      rating: 4,
    },
    {
      client: 'Client number 3',
      text: 'Their professionalism and eye for detail impressed us throughout the project.',
      rating: 5,
    },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-2 text-center">
        <h2 className="text-3xl lg:text-5xl font-bold text-gray-900">
          Our Testimonials
        </h2>
        <p className="text-gray-500 mb-12">
          Everything starts with building trust!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {feedback.map((f, idx) => (
            <div
              key={idx}
              className="bg-[#D9D9D9] p-6 rounded-lg relative text-left shadow-sm"
            >
              {/* decorative quote mark */}
              <span className="absolute top-0 left-3 text-5xl text-black-300 font-serif -translate-y-4">
                “
              </span>

              <div className="mt-6">
                <p className="font-semibold">{f.client}</p>
                <p className="text-gray-700 mt-2 leading-relaxed">{f.text}</p>

                {/* stars */}
                <div className="flex mt-4 space-x-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < f.rating ? 'fill-black text-black' : 'text-gray-400'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
