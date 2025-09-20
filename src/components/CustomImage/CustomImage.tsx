'use client'

import Image from 'next/image'

type CustomImageProps = {
  src: string
  alt: string
  rounded?: boolean
  className?: string
  width: number
  height: number
  priority?: boolean
}

export default function CustomImage({
  src,
  alt,
  rounded = true,
  className = '',
  width,
  height,
  priority = false,
}: CustomImageProps) {
  const containerClasses = `
    ${rounded ? 'rounded-xl overflow-hidden' : ''}
    ${className}
  `

  return (
    <div className={containerClasses} style={{ width, height }}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="object-cover w-full h-full"
        priority={priority}
      />
    </div>
  )
}
