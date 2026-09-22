import SiteClient from './SiteClient'
import { processMetadata } from '@/lib/seo'

export const metadata = processMetadata({
    path: '/',
    title: 'Vaazhga Valamudan – Buy, Sell & Rent Verified Properties in Tamil Nadu',
    description: 'Vaazhga Valamudan is Tamil Nadu\'s most trusted real estate platform. Find verified plots, houses, and agricultural lands in Trichy, Chennai, Madurai & more.',
})

export default function SitePage() {
    return <SiteClient />
}
