'use client'

import Image, { ImageProps } from 'next/image'

type CustomImageProps = {
  rounded?: boolean
  containerClass?: string
  src: string
  alt: string
  className?: string
  fill?: boolean
}

export default function CustomImage({
  src,
  alt,
  rounded = true,
  containerClass = '',
  className = '',
  fill,
  ...rest
}: CustomImageProps) {
  const containerClasses = `
    relative
    ${rounded ? 'rounded-xl overflow-hidden' : ''}
    ${containerClass}
  `.trim()

  const imageClasses = `
    object-cover w-full h-full
    ${className}
  `.trim()

  return (
    <div className={containerClasses}>
      <Image
        src={src}
        alt={alt}
        fill={fill}
        className={imageClasses}
        {...rest}
      />
    </div>
  )
}
