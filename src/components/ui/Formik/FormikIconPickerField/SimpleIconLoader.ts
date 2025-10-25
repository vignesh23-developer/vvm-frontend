'use client';

import { LucideIcon } from 'lucide-react';
import { LucideIconName } from './LucideIconName';

export interface SimpleIconInfo {
  name: LucideIconName;
  component: LucideIcon;
}

/**
 * Simple, working icon loader with guaranteed real estate icons
 */
export class SimpleIconLoader {
  private static instance: SimpleIconLoader;
  private isLoaded = false;
  private icons: SimpleIconInfo[] = [];
  
  // Guaranteed real estate icons that definitely exist in Lucide
  private guaranteedIcons: LucideIconName[] = [
    // Basic UI
    'Home', 'Building', 'MapPin', 'Star', 'Heart', 'Check', 'X',
    'Plus', 'Minus', 'Search', 'Settings', 'Menu', 'ArrowLeft', 'ArrowRight',
    
    // Property Features
    'Bed', 'Car', 'Wifi', 'Shield', 'Lock', 'Key', 'Camera',
    'Phone', 'Mail', 'Globe', 'Clock', 'Calendar', 'User', 'Users',
    
    // Amenities & Facilities  
    'Trees', 'Sun', 'Moon', 'Cloud', 'Zap', 'Flame', 'Droplets',
    'Wind', 'Thermometer', 'Activity', 'Target', 'Award', 'Flag',
    
    // Transportation (removed duplicate Car)
    'Plane', 'Train', 'Bike', 'Bus', 'Truck',
    
    // Comfort
    'Coffee', 'Gift', 'ShoppingCart', 'Store', 'Package', 'Book',
    'Music', 'Video', 'Image', 'File', 'Folder', 'Download', 'Upload'
  ];

  private constructor() {}

  static getInstance(): SimpleIconLoader {
    if (!SimpleIconLoader.instance) {
      SimpleIconLoader.instance = new SimpleIconLoader();
    }
    return SimpleIconLoader.instance;
  }

  async loadIcons(): Promise<{ icons: SimpleIconInfo[]; isLoaded: boolean; error: string | null }> {
    if (this.isLoaded) {
      return { icons: this.icons, isLoaded: this.isLoaded, error: null };
    }

    try {
      console.log('🔄 SimpleIconLoader: Loading guaranteed icons...');
      
      // Dynamic import
      const lucideModule = await import('lucide-react');
      
      // Load only our guaranteed list
      this.icons = this.guaranteedIcons
        .map(name => {
          const component = (lucideModule as any)[name];
          // Accept both functions and ForwardRef objects
          if (component && (typeof component === 'function' || 
              (typeof component === 'object' && component !== null))) {
            return { name, component: component as LucideIcon };
          }
          console.warn(`⚠️ Icon ${name} not found in lucide-react`);
          return null;
        })
        .filter((icon): icon is SimpleIconInfo => icon !== null);

      this.isLoaded = true;
      console.log(`✅ SimpleIconLoader: Loaded ${this.icons.length} guaranteed icons`);
      
      return { icons: this.icons, isLoaded: this.isLoaded, error: null };
      
    } catch (error) {
      const errorMsg = `Failed to load icons: ${error instanceof Error ? error.message : 'Unknown error'}`;
      console.error('❌ SimpleIconLoader error:', error);
      return { icons: [], isLoaded: false, error: errorMsg };
    }
  }

  getAllIcons(): SimpleIconInfo[] {
    return this.icons;
  }

  searchIcons(query: string): SimpleIconInfo[] {
    if (!query.trim()) return this.icons;
    const search = query.toLowerCase();
    return this.icons.filter(icon => 
      icon.name.toLowerCase().includes(search)
    );
  }
}