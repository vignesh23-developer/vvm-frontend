import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import { BLOGS, getBlogBySlug } from '../_data'

type PageProps = {
  params: Promise<{ slug: string }>
}

function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://vaazhgavalamudan.com'
}

export async function generateStaticParams() {
  return BLOGS.map(b => ({ slug: b.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const blog = getBlogBySlug(slug)
  if (!blog) return {}

  const siteUrl = getSiteUrl()
  const canonical = blog.canonicalUrl || `${siteUrl}/blog/${blog.slug}`

  return {
    title: blog.title,
    description: blog.description,
    keywords: [blog.keyword, 'Tamil Nadu real estate', 'Vaazhga Valamudan'],
    alternates: {
      canonical,
    },
    openGraph: {
      title: blog.title,
      description: blog.description,
      url: canonical,
      siteName: 'Vaazhga Valamudan',
      type: 'article',
      images: [
        {
          url: `${siteUrl}/images/image.png`,
          alt: blog.alt,
        },
      ],
    },
  }
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params
  const blog = getBlogBySlug(slug)
  if (!blog) notFound()

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 pt-10 pb-14">
      <div className="max-w-4xl mx-auto">
        <nav className="text-sm text-gray-600">
          <Link href="/" className="hover:underline underline-offset-4">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/blog" className="hover:underline underline-offset-4">
            Blog
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{blog.keyword}</span>
        </nav>

        <header className="mt-6 rounded-3xl border border-yellow-100 bg-white/80 overflow-hidden">
          <div className="relative h-56 sm:h-72">
            <Image src="/images/image.png" alt={blog.alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 768px" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/30 to-transparent" />
          </div>

          <div className="p-6 sm:p-10">
            <p className="text-xs font-semibold text-yellow-700">{blog.keyword}</p>
            <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">{blog.h1}</h1>
            <p className="mt-4 text-gray-700 leading-7">{blog.description}</p>
          </div>
        </header>

        <article className="mt-8 rounded-3xl border border-yellow-100 bg-white/80 p-6 sm:p-10">
          <ReactMarkdown
            components={{
              h2: ({ children }) => <h2 className="mt-10 first:mt-0 text-xl sm:text-2xl font-bold text-gray-900">{children}</h2>,
              h3: ({ children }) => <h3 className="mt-8 text-lg sm:text-xl font-semibold text-gray-900">{children}</h3>,
              p: ({ children }) => <p className="mt-4 text-gray-800 leading-7">{children}</p>,
              ul: ({ children }) => <ul className="mt-4 pl-6 list-disc text-gray-800 space-y-2">{children}</ul>,
              ol: ({ children }) => <ol className="mt-4 pl-6 list-decimal text-gray-800 space-y-2">{children}</ol>,
              li: ({ children }) => <li className="leading-7">{children}</li>,
              strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
              a: ({ href, children }) => (
                <a
                  href={href}
                  className="text-gray-900 font-semibold underline underline-offset-4 hover:text-yellow-700"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {children}
                </a>
              ),
            }}
          >
            {blog.contentMd}
          </ReactMarkdown>
        </article>

        <div className="mt-8 flex items-center justify-between">
          <Link href="/blog" className="text-sm font-semibold text-gray-900 hover:underline underline-offset-4">
            ← Back to Blog
          </Link>
          <Link href="/" className="text-sm font-semibold text-gray-900 hover:underline underline-offset-4">
            Explore properties →
          </Link>
        </div>
      </div>
    </div>
  )
}
