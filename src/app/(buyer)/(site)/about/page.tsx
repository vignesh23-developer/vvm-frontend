import AboutClient from './AboutClient'
import { generateStaticPageMetadata } from '@/lib/seo'

export const metadata = generateStaticPageMetadata(
    'About Us',
    'Learn about Vaazhga Valamudan - Your trusted partner for buying, selling, and renting properties in Tamil Nadu.',
    '/about'
)

export default function AboutPage() {
    return <AboutClient />
}
