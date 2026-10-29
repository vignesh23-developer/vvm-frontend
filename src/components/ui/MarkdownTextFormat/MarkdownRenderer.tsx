'use client'

import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'

interface MarkdownRendererProps {
  content: string
  className?: string
  specialHeading?: string
}

const GUIDE_POINTS = [
  'How to Register as an Agent',
  'How to Complete Aadhaar Verification Successfully',
  'How to Post a High-Quality Property Listing',
  'How to Add Photos, Detailed Descriptions & YouTube Videos',
  'How to View and Manage Leads & Buyer Enquiries',
  'How to Navigate and Use Your Agent Dashboard',
  'How to Upgrade or Renew Your Subscription Plan',
  'How to Share Your Personal Micro-Website Link',
  'How to Save Search Criteria',
]

const MarkdownRenderer = ({
  content,
  className = '',
  specialHeading,
}: MarkdownRendererProps) => {
  // Create a slug/id from heading text to match page TOC links.
  const slugify = (text = '') =>
    text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')

  // Flatten children to plain text.
  const toPlainText = (children: any): string => {
    if (children == null) return ''
    if (typeof children === 'string') return children
    if (typeof children === 'number') return String(children)

    if (Array.isArray(children)) {
      return children.map((child) => toPlainText(child)).join('')
    }

    if (typeof children === 'object' && children.props) {
      return toPlainText(children.props.children)
    }

    return ''
  }


  const components: Components = {
    // H1 headings
    h1: ({ children }) => {
      const text = toPlainText(children)
      const id = slugify(text) || undefined

      return (
        <h1 id={id} className="mb-4 text-3xl font-bold text-gray-900">
          {children}
        </h1>
      )
    },

    // H2 headings
    h2: ({ children }) => {
      const text = toPlainText(children)
      const id = slugify(text) || undefined

      return (
        <h2 id={id} className="mb-3 mt-6 text-2xl font-bold text-gray-800">
          {children}
        </h2>
      )
    },

    // H3 headings
    h3: ({ children }) => {
      const text = toPlainText(children)
      const id = slugify(text) || undefined
      const isSpecialHeading = text.trim() === specialHeading

      return (
        <h3
          id={id}
          className={
            isSpecialHeading
              ? 'mb-2 mt-4 text-xl font-normal text-black'
              : 'mb-2 mt-4 text-xl font-semibold text-gray-700'
          }
        >
          {children}
        </h3>
      )
    },

    // Paragraphs
    p: ({ children }) => (
      <p className="mb-4 leading-relaxed text-gray-600">{children}</p>
    ),

    // Bold text
    strong: ({ children }) => {
      const text = toPlainText(children).trim()

      const unboldPhrases = [
        '₹100 voucher',
        '₹100 voucher!',
        '₹200 voucher',
        '₹200 voucher!',
        'Profile Link',
        'active properties',
        'visitor statistics',
        'lead history',
      ]

      const shouldUnbold = unboldPhrases.includes(text)

      return (
        <strong
          className={
            shouldUnbold
              ? 'font-normal text-gray-900'
              : 'font-bold text-gray-900'
          }
        >
          {children}
        </strong>
      )
    },

    // Italic text
    em: ({ children }) => (
      <em className="italic text-gray-700">{children}</em>
    ),

    // Unordered lists
    ul: ({ children }) => (
      <ul className="mb-4 ml-4 list-disc list-inside space-y-2">
        {children}
      </ul>
    ),

    // Ordered lists
    ol: ({ children }) => (
      <ol className="mb-4 ml-4 list-decimal list-inside space-y-2">
        {children}
      </ol>
    ),

    // List items: unbold only the 9 guide points.
    li: ({ children }) => {
      const text = toPlainText(children).trim()

      const isGuidePoint = GUIDE_POINTS.some(
        (point) =>
          text === point ||
          text.startsWith(`${point} `)
      )

      return (
        <li
          className={`leading-relaxed text-gray-600 ${isGuidePoint ? '[&>strong]:font-normal' : ''
            }`}
        >
          {children}
        </li>
      )
    },

    // Blockquotes
    blockquote: ({ children }) => (
      <blockquote className="my-4 border-l-4 border-[#2B1B12] pl-4 italic text-gray-700">
        {children}
      </blockquote>
    ),

    // Links
    a: ({ children, href }) => (
      <a
        href={href}
        className="font-medium text-[#2B1B12] underline hover:text-[#3A2A20]"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),

    // Inline code and code blocks
    code: ({ children, className }) => {
      const isInline = !className

      if (isInline) {
        return (
          <code className="rounded bg-gray-100 px-2 py-1 font-mono text-sm text-red-600">
            {children}
          </code>
        )
      }

      return (
        <code className="mb-4 block overflow-x-auto rounded-lg bg-gray-100 p-4 font-mono text-sm">
          {children}
        </code>
      )
    },

    // Horizontal rule
    hr: () => <hr className="my-6 border-gray-300" />,
  }

  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown components={components}>{content}</ReactMarkdown>
    </div>
  )
}

export default MarkdownRenderer
