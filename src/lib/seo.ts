import { Metadata } from 'next'

/**
 * SEO Configuration and Utilities for Vaazhga Valamudan
 */

// Site-wide constants
export const SITE_CONFIG = {
    name: 'Vaazhga Valamudan',
    alternateName: 'வாழ்க வளமுடன்', // Tamil brand name
    tagline: 'Buy, Sell & Rent Property in TN',
    description: 'Vaazhga Valamudan (வாழ்க வளமுடன்) - Tamil Nadu\'s trusted real estate platform. Find verified properties in Chennai, Coimbatore, Madurai & more.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://vaazhgavalamudan.com',
    locale: 'ta_IN',
    alternateLocale: 'en_IN',
    twitterHandle: '@VaazhgaValam',
    defaultImage: '/og-image.jpg',
    logo: '/logo.png',
    keywords: [
        // Brand keywords first (most important)
        'Vaazhga Valamudan',
        'வாழ்க வளமுடன்',
        'vaazhgavalamudan',
        'vazhga valamudan',
        // Industry keywords
        'real estate Tamil Nadu',
        'property for sale Chennai',
        'buy house Tamil Nadu',
        'rent apartment Coimbatore',
        'land for sale Madurai',
        'commercial property Tamil Nadu',
        'real estate agent Tamil Nadu',
        'property listing Tamil Nadu',
        'Tamil Nadu property portal',
        'verified properties Tamil Nadu',
        'direct owner properties Tamil Nadu',
        'best real estate site in Tamil Nadu',
        'plots for sale in Tamil Nadu',
    ] as string[],
    contact: {
        email: 'contact@vaazhgavalamudan.com',
        phone: '+91 86800 89800',
        address: 'Tamil Nadu, India',
    },
}

/**
 * Default metadata for all pages
 */
export const DEFAULT_METADATA: Metadata = {
    metadataBase: new URL(SITE_CONFIG.url),
    title: {
        default: `${SITE_CONFIG.name} – ${SITE_CONFIG.tagline}`,
        template: `%s | ${SITE_CONFIG.name}`,
    },
    description: SITE_CONFIG.description,
    keywords: SITE_CONFIG.keywords,
    authors: [{ name: SITE_CONFIG.name, url: SITE_CONFIG.url }],
    creator: SITE_CONFIG.name,
    publisher: SITE_CONFIG.name,

    // Open Graph
    openGraph: {
        type: 'website',
        locale: SITE_CONFIG.locale,
        alternateLocale: SITE_CONFIG.alternateLocale,
        url: SITE_CONFIG.url,
        siteName: SITE_CONFIG.name,
        title: `${SITE_CONFIG.name} – ${SITE_CONFIG.tagline}`,
        description: SITE_CONFIG.description,
        images: [
            {
                url: SITE_CONFIG.defaultImage,
                width: 1200,
                height: 630,
                alt: `${SITE_CONFIG.name} - Real Estate Platform`,
            },
        ],
    },

    // Twitter Card
    twitter: {
        card: 'summary_large_image',
        site: SITE_CONFIG.twitterHandle,
        creator: SITE_CONFIG.twitterHandle,
        title: `${SITE_CONFIG.name} – ${SITE_CONFIG.tagline}`,
        description: SITE_CONFIG.description,
        images: [SITE_CONFIG.defaultImage],
    },

    // Robots
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },

    // Verification
    verification: {
        google: '8fq6jy3pkrKcHL6C20EVifJ3Y6_Bg21Z3Zd5d-hc-ME',
    },

    // Alternate languages
    alternates: {
        languages: {
            'ta-IN': '/',
        },
    },

    // Category
    category: 'real estate',
}

/**
 * Generate metadata for property detail pages
 */
export function generatePropertyMetadata(property: {
    id: string | number
    title: string
    description?: string
    price?: number
    location?: string
    district?: string
    images?: string[]
    propertyType?: string
}): Metadata {
    const title = `${property.title} | ${property.propertyType || 'Property'} in ${property.district || 'Tamil Nadu'}`
    const description = property.description
        ? property.description.substring(0, 160)
        : `${property.title} - ${property.propertyType || 'Property'} available in ${property.location || property.district || 'Tamil Nadu'}. ${property.price ? `Price: ₹${property.price.toLocaleString('en-IN')}` : ''}`

    const url = `${SITE_CONFIG.url}/propertyDetails/${property.id}`
    const image = property.images?.[0] || SITE_CONFIG.defaultImage

    return {
        title,
        description,
        keywords: [
            property.propertyType || 'property',
            property.district || 'Tamil Nadu',
            property.location || '',
            'for sale',
            'real estate',
            SITE_CONFIG.name,
        ].filter(Boolean),

        openGraph: {
            type: 'website',
            url,
            title,
            description,
            siteName: SITE_CONFIG.name,
            locale: SITE_CONFIG.locale,
            images: [{ url: image, width: 1200, height: 630, alt: property.title }],
        },

        twitter: {
            card: 'summary_large_image',
            site: SITE_CONFIG.twitterHandle,
            title,
            description,
            images: [image],
        },

        alternates: {
            canonical: url,
        },
    }
}

/**
 * Generate metadata for ad detail pages
 */
export function generateAdMetadata(ad: {
    id: string | number
    title: string
    description?: string
    category?: string
    location?: string
    images?: string[]
}): Metadata {
    const title = `${ad.title} | ${ad.category || 'Ad'} - Vaazhga Valamudan`
    const description = ad.description
        ? ad.description.substring(0, 160)
        : `${ad.title} - ${ad.category || 'Advertisement'} in ${ad.location || 'Tamil Nadu'}.`

    const url = `${SITE_CONFIG.url}/adsDetails/${ad.id}`
    const image = ad.images?.[0] || SITE_CONFIG.defaultImage

    return {
        title,
        description,
        openGraph: {
            type: 'website',
            url,
            title,
            description,
            siteName: SITE_CONFIG.name,
            images: [{ url: image, width: 1200, height: 630, alt: ad.title }],
        },
        twitter: {
            card: 'summary_large_image',
            site: SITE_CONFIG.twitterHandle,
            title,
            description,
            images: [image],
        },
        alternates: {
            canonical: url,
        },
    }
}

/**
 * Generate metadata for static pages
 */
export function generateStaticPageMetadata(
    title: string,
    description: string,
    path: string
): Metadata {
    const url = `${SITE_CONFIG.url}${path}`

    return {
        title,
        description,
        openGraph: {
            type: 'website',
            url,
            title: `${title} | ${SITE_CONFIG.name}`,
            description,
            siteName: SITE_CONFIG.name,
            images: [{ url: SITE_CONFIG.defaultImage, width: 1200, height: 630 }],
        },
        twitter: {
            card: 'summary_large_image',
            site: SITE_CONFIG.twitterHandle,
            title: `${title} | ${SITE_CONFIG.name}`,
            description,
        },
        alternates: {
            canonical: url,
        },
    }
}

type MetadataProps = {
    title: string
    description: string
    path: string
}

export function processMetadata({ title, description, path }: MetadataProps): Metadata {
    const url = `${SITE_CONFIG.url}${path === '/' ? '' : path}`

    return {
        ...DEFAULT_METADATA,
        title: {
            default: title,
            template: `%s | ${SITE_CONFIG.name}`,
        },
        description,
        openGraph: {
            ...DEFAULT_METADATA.openGraph,
            url,
            title,
            description,
        },
        twitter: {
            ...DEFAULT_METADATA.twitter,
            title,
            description,
        },
        alternates: {
            canonical: url,
        },
    }
}
