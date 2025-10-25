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
  private guaranteedIcons: string[] = [
    // Basic UI (keeping original)
    'Home', 'Building', 'MapPin', 'Star', 'Heart', 'Check', 'X',
    'Plus', 'Minus', 'Search', 'Settings', 'Menu', 'ArrowLeft', 'ArrowRight',

    // Property Features (keeping original + additions)
    'Bed', 'Car', 'Wifi', 'Shield', 'Lock', 'Key', 'Camera',
    'Phone', 'Mail', 'Globe', 'Clock', 'Calendar', 'User', 'Users',

    // Added Real Estate Specific Features
    'Bath', 'Shower', 'Warehouse', 'Hotel', 'School', 'Library', 'Landmark',
    'Mountain', 'ParkingCircle', 'ParkingSquare', 'Plug', 'PlugZap', 'Lightbulb',

    // Sports & Recreation (for gym, swimming, parks)
    'Dumbbell', 'SwimFins', 'Footprints', 'Bike', 'Trees', 'PalmTree', 'Dog',
    'Crosshair', 'Flower', 'Playground', 'Mountain', 'MountainSnow', 'SunDim',

    // Amenities & Facilities (keeping original + additions)
    'Trees', 'Sun', 'Moon', 'Cloud', 'Zap', 'Flame', 'Droplets',
    'Wind', 'Thermometer', 'Activity', 'Target', 'Award', 'Flag',

    // Additional Amenities
    'ShoppingBag', 'Store', 'Utensils', 'Wine', 'Salt', 'Coffee',
    'BaggageClaim', 'Tv', 'Radio', 'Wifi', 'Signal', 'Network', 'Router',

    // Transportation (keeping original)
    'Plane', 'Train', 'Bike', 'Bus', 'Truck',

    // Added Transportation
    'CarFront', 'Car', 'Taxi', 'Tram', 'Ship', 'Anchor', 'ParkingCircle',

    // Security & Safety
    'Shield', 'ShieldCheck', 'ShieldAlert', 'LockKeyhole', 'Fingerprint',
    'Webcam', 'Scan', 'Eye', 'Bell', 'BellRing', 'BellPlus', 'Siren',

    // Utilities & Services
    'Plug', 'PlugZap', 'Lightbulb', 'Fan', 'Smartphone', 'Tv',
    'WashingMachine', 'Timer', 'Alarm', 'Trash', 'Recycle', 'Wrench', 'Tool',

    // Payment & Finance
    'CreditCard', 'Wallet', 'DollarSign', 'Percent', 'Receipt', 'FileText',
    'FileClock', 'FileCheck', 'Calculator', 'BadgePercent', 'BadgeDollarSign',

    // Comfort (keeping original)
    'Coffee', 'Gift', 'ShoppingCart', 'Store', 'Package', 'Book',
    'Music', 'Video', 'Image', 'File', 'Folder', 'Download', 'Upload',

    // Weather & Climate Control
    'Thermometer', 'Snowflake', 'Sun', 'Cloud', 'CloudRain', 'CloudSnow',
    'CloudLightning', 'Wind', 'Umbrella', 'ThermometerSnowflake', 'ThermometerSun',

    // Accessibility
    'Accessibility', 'Elevator', 'Stairs', 'ArrowUp', 'ArrowDown', 'Wheelchair',

    // Communication
    'Wifi', 'Signal', 'Phone', 'PhoneCall', 'MessageSquare', 'Mail',
    'Globe', 'Share', 'Network', 'Router',

    // Environment & Sustainability
    'Leaf', 'Recycle', 'Trees', 'Sprout', 'FlowerPot', 'Plant', 'SolarPanel',
    'Wind', 'Droplets', 'WaterWave', 'Mountain'
  ];

  private constructor() { }

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
            return { name: name as LucideIconName, component: component as LucideIcon };
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