import { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://vaazhgavalamudan.com'
const API_URL = process.env.NEXT_PUBLIC_API_URL

// Tamil Nadu Districts
const DISTRICTS = [
  'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem',
  'Tirunelveli', 'Tiruppur', 'Erode', 'Vellore', 'Thoothukudi',
  'Dindigul', 'Thanjavur', 'Ranipet', 'Sivagangai', 'Kanyakumari',
  'Karur', 'Namakkal', 'Nagapattinam', 'Cuddalore', 'Villupuram',
  'Krishnagiri', 'Dharmapuri', 'Perambalur', 'Ariyalur', 'Nilgiris',
  'Ramanathapuram', 'Virudhunagar', 'Theni', 'Pudukkottai', 'Kallakurichi',
  'Chengalpattu', 'Kanchipuram'
]

// Static pages with priorities
const STATIC_PAGES = [
  { path: '/', changeFrequency: 'daily' as const, priority: 1.0 },
  { path: '/properties-list', changeFrequency: 'hourly' as const, priority: 0.9 },
  { path: '/ads', changeFrequency: 'hourly' as const, priority: 0.8 },
  { path: '/about', changeFrequency: 'monthly' as const, priority: 0.5 },
  { path: '/contact-us', changeFrequency: 'monthly' as const, priority: 0.5 },
  { path: '/pricing', changeFrequency: 'weekly' as const, priority: 0.7 },
  { path: '/login', changeFrequency: 'yearly' as const, priority: 0.3 },
  { path: '/signup', changeFrequency: 'yearly' as const, priority: 0.3 },
]

// Fetch properties from API
async function fetchProperties() {
  if (!API_URL) return []
  try {
    const response = await fetch(`${API_URL}/properties?limit=500&status=APPROVED`, {
      next: { revalidate: 3600 },
    })
    if (!response.ok) return []
    const data = await response.json()
    return data.data || data.items || []
  } catch {
    return []
  }
}

// Fetch ads from API
async function fetchAds() {
  if (!API_URL) return []
  try {
    const response = await fetch(`${API_URL}/ads?limit=500&status=APPROVED`, {
      next: { revalidate: 3600 },
    })
    if (!response.ok) return []
    const data = await response.json()
    return data.data || data.items || []
  } catch {
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date()

  // Static pages
  const staticPages: MetadataRoute.Sitemap = STATIC_PAGES.map((page) => ({
    url: `${BASE_URL}${page.path}`,
    lastModified: currentDate,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }))

  // District exploration pages
  const districtPages: MetadataRoute.Sitemap = DISTRICTS.map((district) => ({
    url: `${BASE_URL}/explore/${encodeURIComponent(district.toLowerCase())}`,
    lastModified: currentDate,
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }))

  // Dynamic property pages
  const properties = await fetchProperties()
  const propertyPages: MetadataRoute.Sitemap = properties.map((property: any) => ({
    url: `${BASE_URL}/propertyDetails/${property.id}`,
    lastModified: property.updated_at ? new Date(property.updated_at) : currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Dynamic ad pages
  const ads = await fetchAds()
  const adPages: MetadataRoute.Sitemap = ads.map((ad: any) => ({
    url: `${BASE_URL}/adsDetails/${ad.id}`,
    lastModified: ad.updated_at ? new Date(ad.updated_at) : currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...districtPages, ...propertyPages, ...adPages]
}
