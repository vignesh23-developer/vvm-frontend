import Image from 'next/image'
import Link from 'next/link'
import { getAllBlogs } from './_data'

export default function BlogIndexPage() {
  const blogs = getAllBlogs()

  return (
    <div className="min-h-screen">
      <section className="px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-3xl border border-yellow-100 bg-white/70 backdrop-blur px-6 sm:px-10 py-10 sm:py-12">
            <p className="text-sm font-semibold text-yellow-700">Vaazhga Valamudan Blog</p>
            <h1 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">Real estate insights for Tamil Nadu</h1>
            <p className="mt-4 max-w-3xl text-gray-700 leading-7">
              Browse guides, platform updates, and practical tips for buyers, sellers, renters, and agents.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 pb-14">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {blogs.map(blog => (
              <article key={blog.slug} className="group rounded-3xl border border-yellow-100 bg-white/80 overflow-hidden">
                <Link href={`/blog/${blog.slug}`} className="block">
                  <div className="relative h-44">
                    <Image
                      src="/images/image.png"
                      alt={blog.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      priority={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/30 to-transparent" />
                  </div>

                  <div className="p-6">
                    <p className="text-xs font-semibold text-yellow-700 truncate">{blog.keyword}</p>
                    <h2 className="mt-2 text-lg font-bold text-gray-900 group-hover:underline underline-offset-4">{blog.title}</h2>
                    <p className="mt-3 text-sm text-gray-700 leading-6">{blog.description}</p>
                    <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gray-900">
                      Read article
                      <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                        →
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
