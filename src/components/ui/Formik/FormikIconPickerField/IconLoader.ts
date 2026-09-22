'use client'

import { LucideIcon } from 'lucide-react'
import { LucideIconName } from './LucideIconName'

export interface IconInfo {
  name: LucideIconName
  component: LucideIcon
  category: string
}

export interface IconLoaderResult {
  icons: IconInfo[]
  isLoaded: boolean
  error: string | null
}

/**
 * Comprehensive utility class for loading ALL Lucide icons
 * Specially curated for real estate projects with amenities and property features
 */
export class IconLoader {
  private static instance: IconLoader
  private isLoaded = false
  private error: string | null = null
  private icons: IconInfo[] = []

  private constructor() {}

  static getInstance(): IconLoader {
    if (!IconLoader.instance) {
      IconLoader.instance = new IconLoader()
    }
    return IconLoader.instance
  }

  /**
   * Categorize icons for real estate applications
   */
  private categorizeIcon(name: string): string {
    const lowerName = name.toLowerCase()

    // Real Estate Amenities & Features
    if (
      lowerName.includes('home') ||
      lowerName.includes('house') ||
      lowerName.includes('building') ||
      lowerName.includes('bed') ||
      lowerName.includes('bath') ||
      lowerName.includes('kitchen') ||
      lowerName.includes('garage') ||
      lowerName.includes('garden') ||
      lowerName.includes('pool')
    ) {
      return 'Property Features'
    }

    // Sports & Recreation
    if (
      lowerName.includes('gym') ||
      lowerName.includes('fitness') ||
      lowerName.includes('swim') ||
      lowerName.includes('tennis') ||
      lowerName.includes('game') ||
      lowerName.includes('play') ||
      lowerName.includes('sport') ||
      lowerName.includes('ball') ||
      lowerName.includes('bike') ||
      lowerName.includes('run') ||
      lowerName.includes('yoga') ||
      lowerName.includes('dumbbell')
    ) {
      return 'Sports & Recreation'
    }

    // Utilities & Services
    if (
      lowerName.includes('wifi') ||
      lowerName.includes('power') ||
      lowerName.includes('electric') ||
      lowerName.includes('water') ||
      lowerName.includes('fire') ||
      lowerName.includes('security') ||
      lowerName.includes('lock') ||
      lowerName.includes('key') ||
      lowerName.includes('shield') ||
      lowerName.includes('camera') ||
      lowerName.includes('bell') ||
      lowerName.includes('phone')
    ) {
      return 'Utilities & Security'
    }

    // Transportation & Parking
    if (
      lowerName.includes('car') ||
      lowerName.includes('parking') ||
      lowerName.includes('garage') ||
      lowerName.includes('bike') ||
      lowerName.includes('bus') ||
      lowerName.includes('train') ||
      lowerName.includes('plane') ||
      lowerName.includes('taxi') ||
      lowerName.includes('truck')
    ) {
      return 'Transportation'
    }

    // Comfort & Lifestyle
    if (
      lowerName.includes('air') ||
      lowerName.includes('fan') ||
      lowerName.includes('heat') ||
      lowerName.includes('cool') ||
      lowerName.includes('coffee') ||
      lowerName.includes('restaurant') ||
      lowerName.includes('shop') ||
      lowerName.includes('store') ||
      lowerName.includes('mall') ||
      lowerName.includes('hotel') ||
      lowerName.includes('spa') ||
      lowerName.includes('salon')
    ) {
      return 'Comfort & Lifestyle'
    }

    // Nature & Environment
    if (
      lowerName.includes('tree') ||
      lowerName.includes('flower') ||
      lowerName.includes('leaf') ||
      lowerName.includes('sun') ||
      lowerName.includes('cloud') ||
      lowerName.includes('wind') ||
      lowerName.includes('mountain') ||
      lowerName.includes('beach') ||
      lowerName.includes('park') ||
      lowerName.includes('garden') ||
      lowerName.includes('forest')
    ) {
      return 'Nature & Environment'
    }

    // Navigation & Directions
    if (
      lowerName.includes('arrow') ||
      lowerName.includes('chevron') ||
      lowerName.includes('direction') ||
      lowerName.includes('map') ||
      lowerName.includes('location') ||
      lowerName.includes('pin') ||
      lowerName.includes('compass') ||
      lowerName.includes('navigation')
    ) {
      return 'Navigation'
    }

    // UI Controls
    if (
      lowerName.includes('check') ||
      lowerName.includes('plus') ||
      lowerName.includes('minus') ||
      lowerName.includes('x') ||
      lowerName.includes('menu') ||
      lowerName.includes('settings') ||
      lowerName.includes('edit') ||
      lowerName.includes('delete') ||
      lowerName.includes('save')
    ) {
      return 'UI Controls'
    }

    return 'Other'
  }

  /**
   * Load ALL available Lucide icons
   */
  async loadIcons(): Promise<IconLoaderResult> {
    if (this.isLoaded) {
      return {
        icons: this.icons,
        isLoaded: this.isLoaded,
        error: this.error,
      }
    }

    try {
      console.log('🔄 Loading ALL Lucide icons...')

      // Dynamic import of lucide-react
      const lucideModule = await import('lucide-react')

      // Get ALL icon names by filtering the module exports
      const allExports = Object.keys(lucideModule)
      console.log(`📦 Found ${allExports.length} total exports from lucide-react`)

      // More permissive filtering - only exclude obvious non-icons
      const iconNames = allExports.filter(key => {
        // Exclude known non-icon exports
        const excludeList = ['createLucideIcon', 'default', 'icons', '__esModule', 'createElement', 'Fragment', 'Component', 'PureComponent']

        if (excludeList.includes(key)) {
          return false
        }

        // Exclude if starts with lowercase (likely utility functions)
        if (key.charAt(0) === key.charAt(0).toLowerCase()) {
          return false
        }

        // Check if it's a valid React component (function OR object with $$typeof)
        const component = (lucideModule as any)[key]

        // Accept if it's a function
        if (typeof component === 'function') {
          return true
        }

        // Accept if it's a ForwardRef object (React 18+ pattern)
        if (typeof component === 'object' && component !== null) {
          // Check for React ForwardRef signature
          if (component.$$typeof || component.render || component.displayName) {
            return true
          }
        }

        return false
      })

      console.log(`🔍 After filtering: ${iconNames.length} potential icon components`)

      // Create icon info objects with categorization
      this.icons = iconNames
        .map(name => {
          try {
            const component = (lucideModule as any)[name]
            // Accept both functions and ForwardRef objects (just like in filtering)
            if (component && (typeof component === 'function' || (typeof component === 'object' && component !== null))) {
              return {
                name: name as LucideIconName,
                component: component as LucideIcon,
                category: this.categorizeIcon(name),
              }
            }
          } catch (error) {
            // Skip this icon if there's an error
            console.warn(`⚠️ Skipping icon ${name}:`, error)
          }
          return null
        })
        .filter((icon): icon is IconInfo => icon !== null)
        .sort((a, b) => a.name.localeCompare(b.name)) // Sort alphabetically

      this.isLoaded = true
      this.error = null

      console.log(`✅ Successfully loaded ${this.icons.length} icons from Lucide`)

      // Log some sample icon names for debugging
      console.log(
        '🔍 Sample icon names:',
        this.icons.slice(0, 10).map(i => i.name),
      )

      // Log category breakdown
      const categoryStats = this.icons.reduce((stats, icon) => {
        stats[icon.category] = (stats[icon.category] || 0) + 1
        return stats
      }, {} as Record<string, number>)

      console.log('📊 Icon categories:', categoryStats)
    } catch (error) {
      this.error = `Failed to load icons: ${error instanceof Error ? error.message : 'Unknown error'}`
      console.error(' Icon loading error:', error)
    }

    return {
      icons: this.icons,
      isLoaded: this.isLoaded,
      error: this.error,
    }
  }

  /**
   * Get a specific icon by name
   */
  getIcon(name: LucideIconName): LucideIcon | null {
    const iconInfo = this.icons.find(icon => icon.name === name)
    return iconInfo?.component || null
  }

  /**
   * Search icons by name
   */
  searchIcons(query: string): IconInfo[] {
    if (!this.isLoaded || !query.trim()) {
      return this.icons
    }

    const searchQuery = query.toLowerCase()
    return this.icons.filter(icon => icon.name.toLowerCase().includes(searchQuery) || icon.category.toLowerCase().includes(searchQuery))
  }

  /**
   * Get icons by category
   */
  getIconsByCategory(category: string): IconInfo[] {
    return this.icons.filter(icon => icon.category === category)
  }

  /**
   * Get all categories
   */
  getCategories(): string[] {
    const categories = [...new Set(this.icons.map(icon => icon.category))]
    return categories.sort()
  }

  /**
   * Get all loaded icons
   */
  getAllIcons(): IconInfo[] {
    return this.icons
  }

  /**
   * Check if icons are loaded
   */
  isIconsLoaded(): boolean {
    return this.isLoaded
  }

  /**
   * Get loading error if any
   */
  getError(): string | null {
    return this.error
  }

  /**
   * Reset the loader (for testing)
   */
  reset(): void {
    this.isLoaded = false
    this.error = null
    this.icons = []
  }
}
