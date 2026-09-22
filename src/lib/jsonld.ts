import { SITE_CONFIG } from './seo'

/**
 * JSON-LD Structured Data Generators for Vaazhga Valamudan
 */

/**
 * Organization Schema - For site-wide identity
 */
export function generateOrganizationSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'RealEstateAgent',
        '@id': `${SITE_CONFIG.url}/#organization`,
        name: SITE_CONFIG.name,
        alternateName: 'வாழ்க வளமுடன்',
        url: SITE_CONFIG.url,
        logo: {
            '@type': 'ImageObject',
            url: `${SITE_CONFIG.url}${SITE_CONFIG.logo}`,
        },
        image: `${SITE_CONFIG.url}${SITE_CONFIG.defaultImage}`,
        description: SITE_CONFIG.description,
        telephone: SITE_CONFIG.contact.phone,
        email: SITE_CONFIG.contact.email,
        address: {
            '@type': 'PostalAddress',
            addressLocality: 'Chennai',
            addressRegion: 'Tamil Nadu',
            addressCountry: 'IN',
        },
        sameAs: [
            'https://facebook.com/vaazhgavalamudan',
            'https://x.com/VaazhgaValam',
            'https://instagram.com/vaazhga._.valamudan',
            'https://linkedin.com/in/vaazhga-valamudan-tn',
            'https://youtube.com/channel/UCKZeGT6UEKrZ3VChNpV2RqQ',
        ],
        areaServed: {
            '@type': 'State',
            name: 'Tamil Nadu',
        },
    }
}

/**
 * WebSite Schema - For site-wide search
 */
export function generateWebSiteSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${SITE_CONFIG.url}/#website`,
        url: SITE_CONFIG.url,
        name: SITE_CONFIG.name,
        description: SITE_CONFIG.description,
        publisher: {
            '@id': `${SITE_CONFIG.url}/#organization`,
        },
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `${SITE_CONFIG.url}/properties-list?location={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
        },
        inLanguage: ['ta', 'en'],
    }
}

/**
 * RealEstateListing Schema - For property pages
 */
export function generatePropertySchema(property: {
    id: string | number
    title: string
    description?: string
    price?: number
    propertyType?: string
    listingType?: string
    location?: string
    district?: string
    size?: number
    sizeUnit?: string
    images?: string[]
    datePosted?: string
    dateModified?: string
    agent?: {
        name?: string
        phone?: string
    }
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'RealEstateListing',
        '@id': `${SITE_CONFIG.url}/propertyDetails/${property.id}`,
        name: property.title,
        description: property.description,
        url: `${SITE_CONFIG.url}/propertyDetails/${property.id}`,
        datePosted: property.datePosted,
        dateModified: property.dateModified,
        image: property.images || [],
        offers: property.price
            ? {
                '@type': 'Offer',
                price: property.price,
                priceCurrency: 'INR',
                availability: 'https://schema.org/InStock',
            }
            : undefined,
        address: {
            '@type': 'PostalAddress',
            addressLocality: property.location,
            addressRegion: property.district || 'Tamil Nadu',
            addressCountry: 'IN',
        },
        floorSize: property.size
            ? {
                '@type': 'QuantitativeValue',
                value: property.size,
                unitText: property.sizeUnit || 'sq ft',
            }
            : undefined,
        broker: property.agent
            ? {
                '@type': 'RealEstateAgent',
                name: property.agent.name,
                telephone: property.agent.phone,
            }
            : undefined,
    }
}

/**
 * BreadcrumbList Schema - For navigation
 */
export function generateBreadcrumbSchema(
    items: Array<{ name: string; url: string }>
) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: `${SITE_CONFIG.url}${item.url}`,
        })),
    }
}

/**
 * LocalBusiness Schema - For contact page
 */
export function generateLocalBusinessSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'RealEstateAgent',
        '@id': `${SITE_CONFIG.url}/#localbusiness`,
        name: SITE_CONFIG.name,
        alternateName: 'வாழ்க வளமுடன்',
        image: `${SITE_CONFIG.url}${SITE_CONFIG.logo}`,
        url: SITE_CONFIG.url,
        telephone: '+91 86800 89800',
        email: 'contact@vaazhgavalamudan.com',
        description: SITE_CONFIG.description,
        address: {
            '@type': 'PostalAddress',
            streetAddress: 'No D-54/1, TS No. 106, SP ARCADE, 9A Cross West Extension, Thillai Nagar',
            addressLocality: 'Tiruchirappalli',
            addressRegion: 'Tamil Nadu',
            postalCode: '620018',
            addressCountry: 'IN',
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: 10.8239,
            longitude: 78.6912,
        },
        areaServed: {
            '@type': 'State',
            name: 'Tamil Nadu',
        },
        openingHoursSpecification: [
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                opens: '09:00',
                closes: '18:00',
            },
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: 'Saturday',
                opens: '09:00',
                closes: '14:00',
            },
        ],
        priceRange: '₹₹',
        sameAs: [
            'https://facebook.com/vaazhgavalamudan',
            'https://x.com/VaazhgaValam',
            'https://instagram.com/vaazhga._.valamudan',
            'https://linkedin.com/in/vaazhga-valamudan-tn',
        ],
    }
}

/**
 * FAQ Schema - For FAQ pages
 */
export function generateFAQSchema(
    faqs: Array<{ question: string; answer: string }>
) {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
            },
        })),
    }
}
