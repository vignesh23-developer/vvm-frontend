'use client';

import React, { useEffect, useState } from 'react';

export default function DeepDiagnosticTest() {
  const [diagnostics, setDiagnostics] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const runDiagnostics = async () => {
      console.log('🔍 Running deep diagnostics...');
      
      try {
        // Test 1: Static import
        console.log('📝 Test 1: Static import');
        const staticImport = await import('lucide-react');
        console.log('Static import result:', staticImport);
        console.log('Static import keys:', Object.keys(staticImport));
        console.log('Static import keys count:', Object.keys(staticImport).length);
        
        // Test 2: Check specific icons
        console.log('📝 Test 2: Check specific icons');
        const homeIcon = staticImport.Home;
        const userIcon = staticImport.User;
        const starIcon = staticImport.Star;
        
        console.log('Home icon:', homeIcon, typeof homeIcon);
        console.log('User icon:', userIcon, typeof userIcon);
        console.log('Star icon:', starIcon, typeof starIcon);
        
        // Test 3: Try to render an icon
        console.log('📝 Test 3: Render test');
        let renderTest = null;
        if (homeIcon && typeof homeIcon === 'function') {
          try {
            renderTest = React.createElement(homeIcon, { size: 24 });
            console.log('Render test successful:', renderTest);
          } catch (e) {
            console.log('Render test failed:', e);
          }
        }
        
        // Test 4: Check for alternative exports
        console.log('📝 Test 4: Alternative exports');
        console.log('icons property:', staticImport.icons);
        console.log('default export:', staticImport.default);
        
        // Test 5: Filter analysis
        console.log('📝 Test 5: Filter analysis');
        const allKeys = Object.keys(staticImport);
        const functions = allKeys.filter(key => typeof (staticImport as any)[key] === 'function');
        const objects = allKeys.filter(key => typeof (staticImport as any)[key] === 'object' && (staticImport as any)[key] !== null);
        const upperCaseStarts = allKeys.filter(key => key.charAt(0) === key.charAt(0).toUpperCase());
        const potentialIcons = allKeys.filter(key => {
          const component = (staticImport as any)[key];
          const isComponent = typeof component === 'function' || 
                             (typeof component === 'object' && component !== null);
          return isComponent && key.charAt(0) === key.charAt(0).toUpperCase() &&
                 !['Fragment', 'Component', 'PureComponent', 'createElement', 'default', 'icons'].includes(key);
        });
        
        console.log('All keys:', allKeys.length);
        console.log('Functions:', functions.length);
        console.log('Objects:', objects.length);
        console.log('Uppercase starts:', upperCaseStarts.length);
        console.log('Potential icons:', potentialIcons.length);
        console.log('Sample potential icons:', potentialIcons.slice(0, 10));
        
        setDiagnostics({
          staticImport: {
            success: true,
            keyCount: allKeys.length,
            functions: functions.length,
            objects: objects.length,
            potentialIcons: potentialIcons.length,
            sampleKeys: allKeys.slice(0, 20),
            sampleIcons: potentialIcons.slice(0, 10)
          },
          specificIcons: {
            home: { exists: !!homeIcon, type: typeof homeIcon },
            user: { exists: !!userIcon, type: typeof userIcon },
            star: { exists: !!starIcon, type: typeof starIcon }
          },
          renderTest: !!renderTest
        });
        
      } catch (error) {
        console.error('❌ Diagnostic error:', error);
        setDiagnostics({
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
      
      setLoading(false);
    };

    runDiagnostics();
  }, []);

  if (loading) {
    return (
      <div className="p-4 border rounded bg-purple-50">
        <h3 className="text-lg font-bold mb-2">🔍 Running Deep Diagnostics...</h3>
        <div className="animate-pulse">Analyzing lucide-react module...</div>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded bg-white">
      <h3 className="text-lg font-bold mb-4">🔬 Deep Diagnostic Results</h3>
      
      {diagnostics.error ? (
        <div className="p-3 bg-red-50 border border-red-200 rounded mb-4">
          <strong className="text-red-800">Error:</strong>
          <p className="text-red-600 text-sm mt-1">{diagnostics.error}</p>
        </div>
      ) : (
        <div className="space-y-4">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded">
              <strong>Module Import:</strong>
              <div className="text-sm mt-1">
                <div>Total Keys: {diagnostics.staticImport?.keyCount || 0}</div>
                <div>Functions: {diagnostics.staticImport?.functions || 0}</div>
                <div>Objects: {diagnostics.staticImport?.objects || 0}</div>
                <div>Potential Icons: {diagnostics.staticImport?.potentialIcons || 0}</div>
              </div>
            </div>          <div className="p-3 bg-green-50 border border-green-200 rounded">
            <strong>Sample Keys:</strong>
            <div className="text-xs mt-1 max-h-20 overflow-y-auto">
              {diagnostics.staticImport?.sampleKeys?.join(', ') || 'None'}
            </div>
          </div>
          
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
            <strong>Potential Icons:</strong>
            <div className="text-xs mt-1">
              {diagnostics.staticImport?.sampleIcons?.join(', ') || 'None found'}
            </div>
          </div>
          
          <div className="p-3 bg-gray-50 border border-gray-200 rounded">
            <strong>Specific Icon Tests:</strong>
            <div className="text-sm mt-1">
              <div>Home: {diagnostics.specificIcons?.home?.exists ? '✅' : '❌'} ({diagnostics.specificIcons?.home?.type})</div>
              <div>User: {diagnostics.specificIcons?.user?.exists ? '✅' : '❌'} ({diagnostics.specificIcons?.user?.type})</div>
              <div>Star: {diagnostics.specificIcons?.star?.exists ? '✅' : '❌'} ({diagnostics.specificIcons?.star?.type})</div>
            </div>
          </div>
          
          <div className="p-3 bg-purple-50 border border-purple-200 rounded">
            <strong>Render Test:</strong>
            <div className="text-sm mt-1">
              {diagnostics.renderTest ? '✅ Can render icons' : '❌ Cannot render icons'}
            </div>
          </div>
        </div>
      )}
      
      <div className="text-xs text-gray-500 mt-4">
        <strong>Purpose:</strong> This diagnostic shows exactly what's in the lucide-react module 
        and why our icon loaders are finding 0 icons.
      </div>
    </div>
  );
}