/** Buyer routes that should work without login prompts or stale-token 401 side effects. */
const PUBLIC_BROWSING_PREFIXES = [
  '/agent-profile/',
  '/agents-list',
  '/properties-list',
  '/propertyDetails/',
  '/adsDetails/',
  '/pricing',
] as const

export function isPublicBrowsingPath(pathname: string): boolean {
  return PUBLIC_BROWSING_PREFIXES.some(
    prefix => pathname === prefix || pathname.startsWith(prefix),
  )
}
