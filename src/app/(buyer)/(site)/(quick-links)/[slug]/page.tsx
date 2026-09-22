import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import { QUICKLINKS, getQuickLinkBySlug, normalizeQuickLinkSlug } from '../_data'

type PageProps = {
  params: Promise<{ slug: string }>
}

function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://vaazhgavalamudan.com'
}

export async function generateStaticParams() {
  return QUICKLINKS.map(q => ({ slug: normalizeQuickLinkSlug(q.slug) }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const quickLink = getQuickLinkBySlug(slug)
  if (!quickLink) return {}

  const siteUrl = getSiteUrl()
  const canonical = `${siteUrl}/quick-links/${normalizeQuickLinkSlug(quickLink.slug)}`

  return {
    title: quickLink.title,
    description: quickLink.metaDescription,
    keywords: [...quickLink.keywords, 'Tamil Nadu real estate', 'Vaazhga Valamudan'],
    alternates: {
      canonical,
    },
    openGraph: {
      title: quickLink.title,
      description: quickLink.metaDescription,
      url: canonical,
      siteName: 'Vaazhga Valamudan',
      type: 'article',
    },
  }
}

export default async function QuickLinksDetailPage({ params }: PageProps) {
  const { slug } = await params
  const quickLink = getQuickLinkBySlug(slug)
  if (!quickLink) notFound()

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-yellow-50/50 via-white to-white px-4 sm:px-6 lg:px-8 pt-10 pb-14">
      <div aria-hidden className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-yellow-200/30 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-28 -right-28 h-80 w-80 rounded-full bg-yellow-100/60 blur-3xl" />

      <div className="relative max-w-4xl mx-auto">
        <nav className="text-sm text-gray-600 flex flex-wrap items-center gap-x-2 gap-y-1">
          <Link
            href="/"
            className="rounded-full px-2 py-1 transition hover:bg-white/70 hover:text-gray-900 hover:shadow-sm hover:underline underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 focus-visible:ring-offset-2"
          >
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium line-clamp-1">{quickLink.title}</span>
        </nav>

        <header className="mt-6 relative rounded-3xl border border-yellow-100/70 bg-white/70 backdrop-blur overflow-hidden shadow-sm ring-1 ring-yellow-200/30">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 via-white to-transparent" />

          <div className="relative p-6 sm:p-10">
            <div className="flex items-start gap-4">
              <div
                aria-hidden
                className="shrink-0 rounded-2xl border border-yellow-200/70 bg-yellow-50/70 px-4 py-3 text-xl leading-none text-yellow-900 shadow-sm shadow-yellow-100/40"
              >
                {quickLink.emoji}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">{quickLink.title}</h1>
                <p className="mt-3 text-gray-700 leading-7">{quickLink.metaDescription}</p>

                {quickLink.keywords?.length ? (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {quickLink.keywords.map(keyword => (
                      <span
                        key={keyword}
                        className="inline-flex items-center rounded-full border border-yellow-100 bg-white/70 px-3 py-1 text-xs font-semibold text-gray-800 shadow-sm"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </header>

        <article className="mt-8 relative rounded-3xl border border-yellow-100/70 bg-white/70 backdrop-blur p-6 sm:p-10 shadow-sm overflow-hidden ring-1 ring-yellow-200/30">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-yellow-50/40" />

          <div className="relative text-[15px] sm:text-base">
            <ReactMarkdown
              components={{
                h1: ({ children }) => <h2 className="relative mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">{children}</h2>,
                h2: ({ children }) => (
                  <h2 className="relative mt-12 first:mt-0 text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
                    <span className="inline-block border-b-2 border-yellow-200 pb-2">{children}</span>
                  </h2>
                ),
                h3: ({ children }) => <h3 className="relative mt-10 text-lg sm:text-xl font-semibold text-gray-900">{children}</h3>,
                p: ({ children }) => <p className="mt-4 text-gray-700 leading-7">{children}</p>,
                ul: ({ children }) => <ul className="mt-5 pl-6 list-disc text-gray-700 space-y-2 marker:text-yellow-700">{children}</ul>,
                ol: ({ children }) => <ol className="mt-5 pl-6 list-decimal text-gray-700 space-y-2 marker:text-yellow-700">{children}</ol>,
                li: ({ children }) => <li className="leading-7">{children}</li>,
                strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
                em: ({ children }) => <em className="italic text-gray-800">{children}</em>,
                blockquote: ({ children }) => (
                  <blockquote className="mt-7 rounded-2xl border border-yellow-100 bg-gradient-to-b from-yellow-50/80 to-white/40 px-5 py-4 text-gray-800 shadow-sm">
                    <div className="border-l-4 border-yellow-400 pl-4 leading-7">{children}</div>
                  </blockquote>
                ),
                hr: () => <hr className="my-8 border-yellow-100" />,
                a: ({ href, children }) => (
                  <a
                    href={href}
                    className="text-gray-900 font-semibold underline decoration-yellow-300 underline-offset-4 transition-colors hover:text-yellow-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 focus-visible:ring-offset-2"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {children}
                  </a>
                ),
                code: ({ className, children }) => {
                  const isInline = !className
                  if (isInline) {
                    return (
                      <code className="rounded-md border border-gray-200 bg-gray-50 px-1.5 py-0.5 font-mono text-[0.925em] text-gray-900 shadow-sm">
                        {children}
                      </code>
                    )
                  }

                  return <code className="block whitespace-pre-wrap break-words font-mono text-sm text-gray-100">{children}</code>
                },
                pre: ({ children }) => (
                  <pre className="mt-7 overflow-x-auto rounded-2xl border border-gray-200 bg-gray-900 px-5 py-4 shadow-sm ring-1 ring-white/10">
                    {children}
                  </pre>
                ),
                table: ({ children }) => (
                  <div className="mt-6 overflow-x-auto rounded-2xl border border-yellow-100 bg-white">
                    <table className="w-full border-collapse text-left text-sm">{children}</table>
                  </div>
                ),
                thead: ({ children }) => <thead className="bg-yellow-50/70 text-gray-900">{children}</thead>,
                th: ({ children }) => <th className="border-b border-yellow-100 px-4 py-3 font-semibold">{children}</th>,
                td: ({ children }) => <td className="border-b border-yellow-100 px-4 py-3 text-gray-800 align-top">{children}</td>,
                img: ({ src, alt }) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={src || ''} alt={alt || ''} className="mt-7 w-full rounded-2xl border border-yellow-100 bg-white shadow-sm" />
                ),
              }}
            >
              {String(quickLink.content)}
            </ReactMarkdown>
          </div>
        </article>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-yellow-100 bg-white/70 px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-white hover:shadow-md hover:underline underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 focus-visible:ring-offset-2"
          >
            ← Back to home
          </Link>
          <Link
            href="/properties-list"
            className="inline-flex items-center justify-center rounded-full border border-yellow-100 bg-white/70 px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-white hover:shadow-md hover:underline underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 focus-visible:ring-offset-2"
          >
            Explore properties →
          </Link>
        </div>
      </div>
    </div>
  )
}
