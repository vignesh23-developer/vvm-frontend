// components/PropertyVideos.tsx
export default function PropertyVideos() {
  const videos = [
    {
      id: 1,
      url: 'https://www.youtube.com/embed/ZCu_Uh8vO5k?si=SZouocr_ZB647Bw6',
      title: 'Property Tour 1',
    },
    {
      id: 2,
      url: 'https://www.youtube.com/embed/ZCu_Uh8vO5k?si=SZouocr_ZB647Bw6',
      title: 'Property Tour 2',
    },
    {
      id: 3,
      url: 'https://www.youtube.com/embed/ZCu_Uh8vO5k?si=SZouocr_ZB647Bw6',
      title: 'Property Tour 3',
    },
  ]

  return (
    <section className="py-5">
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Heading */}
        <h2 className="text-3xl lg:text-5xl font-bold text-gray-900">
          Explore Our Property Videos
        </h2>
        <p className="mt-3 text-gray-600 text-lg max-w-2xl mx-auto">
          Virtual tours, market insights, and expert tips – all in one place.
        </p>

        {/* Video grid */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {videos.map(video => (
            <div
              key={video.id}
              className="relative group rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300"
            >
              {/* Responsive iframe wrapper */}
              <div className="aspect-video w-full">
                <iframe
                  src={video.url}
                  title={video.title}
                  className="w-full h-full rounded-2xl"
                  frameBorder={0}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </div>

              {/* Overlay title */}
              {/* <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent text-white text-base font-medium p-4 opacity-0 group-hover:opacity-100 transition duration-300">
                {video.title}
              </div> */}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
