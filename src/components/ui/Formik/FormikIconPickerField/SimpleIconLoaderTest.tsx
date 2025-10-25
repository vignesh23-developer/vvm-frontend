'use client';

import React, { useEffect, useState } from 'react';
import { SimpleIconLoader } from './SimpleIconLoader';

export default function SimpleIconLoaderTest() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testLoader = async () => {
      console.log('🧪 Starting SimpleIconLoader test...');
      const loader = SimpleIconLoader.getInstance();
      const result = await loader.loadIcons();
      setResult(result);
      setLoading(false);
      console.log('🧪 SimpleIconLoader test result:', result);
    };

    testLoader();
  }, []);

  if (loading) {
    return (
      <div className="p-4 border rounded bg-blue-50">
        <h3 className="text-lg font-bold mb-2">🔄 Loading Guaranteed Icons...</h3>
        <div className="animate-pulse">Loading real estate icons...</div>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded bg-white">
      <h3 className="text-lg font-bold mb-4">🛡️ Guaranteed Icon Loader Test</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <strong>Status:</strong> 
          <span className={`ml-2 px-2 py-1 rounded text-sm ${result?.isLoaded ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {result?.isLoaded ? '✅ Loaded' : '❌ Failed'}
          </span>
        </div>
        
        <div>
          <strong>Guaranteed Icons:</strong> 
          <span className="ml-2 font-mono text-lg text-blue-600">
            {result?.icons?.length || 0}
          </span>
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
          <strong>All Guaranteed Icons:</strong>
          <div className="grid grid-cols-10 gap-2 mt-2 max-h-48 overflow-y-auto border p-2 rounded">
            {result.icons.map((icon: any) => {
              const IconComponent = icon.component;
              return (
                <div key={icon.name} className="flex flex-col items-center p-1 border rounded hover:bg-gray-50">
                  <IconComponent className="h-5 w-5 mb-1" />
                  <span className="text-xs text-center leading-tight" title={icon.name}>
                    {icon.name.length > 6 ? icon.name.substring(0, 6) + '...' : icon.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="text-xs text-gray-500 mt-4">
        <strong>Fallback Loader:</strong> This uses a curated list of guaranteed Lucide icons 
        specifically chosen for real estate applications. Should always work!
      </div>
    </div>
  );
}