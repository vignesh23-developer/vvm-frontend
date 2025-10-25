'use client';

import React, { useState, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';

export default function DirectIconTest() {
  const [iconCount, setIconCount] = useState(0);
  const [sampleIcons, setSampleIcons] = useState<any[]>([]);
  const [realEstateIcons, setRealEstateIcons] = useState<any[]>([]);

  useEffect(() => {
    console.log('🔍 Direct Lucide import test...');
    
    // Get all exports from lucide-react
    const allExports = Object.keys(LucideIcons);
    console.log('📦 All Lucide exports:', allExports.length);
    
    // Filter for likely icon components
    const likelyIcons = allExports.filter(key => {
      const component = (LucideIcons as any)[key];
      // Accept both functions and ForwardRef objects
      const isComponent = typeof component === 'function' || 
                         (typeof component === 'object' && component !== null);
      
      return isComponent && 
             key.charAt(0) === key.charAt(0).toUpperCase() &&
             !['Fragment', 'Component', 'PureComponent', 'createElement', 'default', 'icons'].includes(key);
    });
    
    console.log('🎯 Likely icon components:', likelyIcons.length);
    console.log('📝 Sample icon names:', likelyIcons.slice(0, 20));
    
    setIconCount(likelyIcons.length);
    
    // Get sample icons
    const samples = likelyIcons.slice(0, 12).map(name => ({
      name,
      component: (LucideIcons as any)[name]
    }));
    setSampleIcons(samples);
    
    // Get real estate specific icons
    const realEstateTerms = [
      'home', 'house', 'building', 'bed', 'bath', 'kitchen', 'garage', 
      'garden', 'pool', 'gym', 'car', 'park', 'wifi', 'security', 'lock',
      'air', 'water', 'fire', 'tree', 'flower', 'sun', 'star', 'heart'
    ];
    
    const realEstateMatches = likelyIcons.filter(name => 
      realEstateTerms.some(term => name.toLowerCase().includes(term))
    ).map(name => ({
      name,
      component: (LucideIcons as any)[name]
    }));
    
    console.log('🏠 Real estate icons found:', realEstateMatches.length);
    setRealEstateIcons(realEstateMatches);
    
  }, []);

  return (
    <div className="p-4 border rounded bg-green-50">
      <h3 className="text-lg font-bold mb-4">🔬 Direct Lucide Import Test</h3>
      
      <div className="mb-4">
        <strong>Total Likely Icons:</strong> 
        <span className="ml-2 font-mono text-lg text-green-600">{iconCount}</span>
      </div>
      
      <div className="mb-4">
        <strong>Sample Icons (First 12):</strong>
        <div className="grid grid-cols-6 gap-2 mt-2">
          {sampleIcons.map(({ name, component: IconComponent }) => (
            <div key={name} className="flex flex-col items-center p-2 border rounded bg-white">
              <IconComponent className="h-6 w-6 mb-1" />
              <span className="text-xs text-center">{name}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-4">
        <strong>Real Estate Icons ({realEstateIcons.length}):</strong>
        <div className="grid grid-cols-8 gap-2 mt-2 max-h-32 overflow-y-auto">
          {realEstateIcons.slice(0, 24).map(({ name, component: IconComponent }) => (
            <div key={name} className="flex flex-col items-center p-1 border rounded bg-white hover:bg-gray-50">
              <IconComponent className="h-5 w-5 mb-1" />
              <span className="text-xs text-center leading-tight" title={name}>
                {name.length > 8 ? name.substring(0, 8) + '...' : name}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="text-xs text-gray-600 mt-4">
        This test imports lucide-react directly to verify icon availability
      </div>
    </div>
  );
}