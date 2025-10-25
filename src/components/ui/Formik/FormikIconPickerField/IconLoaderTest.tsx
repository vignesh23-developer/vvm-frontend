'use client';

import React, { useEffect, useState } from 'react';
import { IconLoader } from './IconLoader';

export default function IconLoaderTest() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const testLoader = async () => {
      console.log('🧪 Starting IconLoader test...');
      const loader = IconLoader.getInstance();
      const result = await loader.loadIcons();
      setResult(result);
      
      if (result.isLoaded) {
        const cats = loader.getCategories();
        setCategories(cats);
        console.log('📊 Categories found:', cats);
      }
      
      setLoading(false);
      console.log('🧪 Icon loader test result:', result);
    };

    testLoader();
  }, []);

  if (loading) {
    return (
      <div className="p-4 border rounded bg-blue-50">
        <h3 className="text-lg font-bold mb-2">🔄 Loading All Lucide Icons...</h3>
        <div className="animate-pulse">Loading thousands of icons...</div>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded bg-white">
      <h3 className="text-lg font-bold mb-4">🎯 Real Estate Icon Loader Test</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <strong>Status:</strong> 
          <span className={`ml-2 px-2 py-1 rounded text-sm ${result?.isLoaded ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {result?.isLoaded ? '✅ Loaded' : '❌ Failed'}
          </span>
        </div>
        
        <div>
          <strong>Total Icons:</strong> 
          <span className="ml-2 font-mono text-lg text-blue-600">
            {result?.icons?.length || 0}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <strong>Categories ({categories.length}):</strong>
        <div className="flex flex-wrap gap-1 mt-2">
          {categories.map(cat => (
            <span key={cat} className="bg-gray-100 px-2 py-1 rounded text-xs">
              {cat}
            </span>
          ))}
        </div>
      </div>
      
      {result?.error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
          <strong className="text-red-800">Error:</strong> 
          <p className="text-red-600 text-sm mt-1">{result.error}</p>
        </div>
      )}
      
      {result?.icons?.length > 0 && (
        <div className="mb-4">
          <strong>Real Estate Amenity Icons Sample:</strong>
          <div className="grid grid-cols-8 gap-2 mt-2 max-h-32 overflow-y-auto">
            {result.icons
              .filter((icon: any) => {
                const name = icon.name.toLowerCase();
                return name.includes('home') || name.includes('bed') || name.includes('bath') || 
                       name.includes('gym') || name.includes('pool') || name.includes('park') ||
                       name.includes('car') || name.includes('wifi') || name.includes('security') ||
                       name.includes('air') || name.includes('garden') || name.includes('building');
              })
              .slice(0, 24)
              .map((icon: any) => {
                const IconComponent = icon.component;
                return (
                  <div key={icon.name} className="flex flex-col items-center p-1 border rounded hover:bg-gray-50">
                    <IconComponent className="h-5 w-5 mb-1" />
                    <span className="text-xs text-center leading-tight" title={icon.name}>
                      {icon.name.length > 8 ? icon.name.substring(0, 8) + '...' : icon.name}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      <div className="text-xs text-gray-500 mt-4">
        <strong>Debug Info:</strong> This test loads ALL Lucide icons (~{result?.icons?.length || 0} total) 
        with special categorization for real estate amenities and property features.
      </div>
    </div>
  );
}