export function isYoutubeUrl(url?: string): boolean {
  if (!url) return false
  try {
    const host = new URL(url).hostname.replace(/^www\./, '')
    return host === 'youtube.com' || host === 'youtu.be' || host === 'm.youtube.com' || host === 'youtube-nocookie.com'
  } catch {
    return /youtube\.com|youtu\.be/i.test(url)
  }
}

export function isYoutubeShortsUrl(url?: string): boolean {
  if (!url || !isYoutubeUrl(url)) return false
  try {
    return new URL(url).pathname.toLowerCase().includes('/shorts/')
  } catch {
    return /\/shorts\//i.test(url)
  }
}

export function isInstagramUrl(url?: string): boolean {
  if (!url) return false
  try {
    const host = new URL(url).hostname.replace(/^www\./, '')
    return host === 'instagram.com' || host === 'instagr.am'
  } catch {
    return /instagram\.com|instagr\.am/i.test(url)
  }
}

export function isSupportedExternalVideoUrl(url?: string): boolean {
  return isYoutubeUrl(url) || isInstagramUrl(url)
}

export function extractYoutubeId(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|watch\?v=|watch\?.+&v=)|youtube-nocookie\.com\/(?:embed\/|shorts\/))([^#&?/]+)/,
  )
  const id = match?.[1]
  return id && id.length >= 10 && id.length <= 12 ? id : null
}

export function getYoutubeEmbedUrl(url: string): string {
  if (!url) return ''
  const id = extractYoutubeId(url)
  if (id) return `https://www.youtube.com/embed/${id}`
  if (url.includes('youtube.com/watch')) return url.replace('watch?v=', 'embed/')
  if (url.includes('youtu.be/')) return url.replace('youtu.be/', 'www.youtube.com/embed/')
  if (url.includes('/shorts/')) {
    const shortsId = url.match(/\/shorts\/([^#&?/]+)/)?.[1]
    if (shortsId) return `https://www.youtube.com/embed/${shortsId}`
  }
  return url
}

export function getYoutubeThumbnail(url: string): string | null {
  const id = extractYoutubeId(url)
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null
}

export function getExternalVideoLabel(url: string): string {
  if (isInstagramUrl(url)) return 'Instagram Reel'
  if (isYoutubeShortsUrl(url)) return 'YouTube Shorts'
  if (isYoutubeUrl(url)) return 'YouTube Video'
  return 'Video Link'
}
