'use client'

import ReactMarkdown from 'react-markdown'
import { Components } from 'react-markdown'

interface MarkdownRendererProps {
    content: string
    className?: string
}

const MarkdownRenderer = ({ content, className = '' }: MarkdownRendererProps) => {
    // Custom components for styling markdown elements
    const components: Components = {
        // Headings
        h1: ({ children }) => (
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{children}</h1>
        ),
        h2: ({ children }) => (
            <h2 className="text-2xl font-bold text-gray-800 mb-3 mt-6">{children}</h2>
        ),
        h3: ({ children }) => (
            <h3 className="text-xl font-semibold text-gray-700 mb-2 mt-4">{children}</h3>
        ),

        // Paragraphs
        p: ({ children }) => (
            <p className="text-gray-600 leading-relaxed mb-4">{children}</p>
        ),

        // Bold text
        strong: ({ children }) => (
            <strong className="font-bold text-gray-900">{children}</strong>
        ),

        // Italic text
        em: ({ children }) => (
            <em className="italic text-gray-700">{children}</em>
        ),

        // Unordered lists
        ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-2 mb-4 ml-4">{children}</ul>
        ),

        // Ordered lists
        ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-2 mb-4 ml-4">{children}</ol>
        ),

        // List items
        li: ({ children }) => (
            <li className="text-gray-600 leading-relaxed">{children}</li>
        ),

        // Blockquotes
        blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-[#2B1B12] pl-4 italic text-gray-700 my-4">
                {children}
            </blockquote>
        ),

        // Links
        a: ({ children, href }) => (
            <a
                href={href}
                className="text-[#2B1B12] hover:text-[#3A2A20] underline font-medium"
                target="_blank"
                rel="noopener noreferrer"
            >
                {children}
            </a>
        ),

        // Code blocks
        code: ({ children, className }) => {
            const isInline = !className
            if (isInline) {
                return (
                    <code className="bg-gray-100 text-red-600 px-2 py-1 rounded text-sm font-mono">
                        {children}
                    </code>
                )
            }
            return (
                <code className="block bg-gray-100 p-4 rounded-lg text-sm font-mono overflow-x-auto mb-4">
                    {children}
                </code>
            )
        },

        // Horizontal rule
        hr: () => <hr className="border-gray-300 my-6" />,
    }

    return (
        <div className={`markdown-content ${className}`}>
            <ReactMarkdown components={components}>{content}</ReactMarkdown>
        </div>
    )
}

export default MarkdownRenderer