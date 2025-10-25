'use client';

import React from 'react';
import { Home, User, Star, Building, Car, Heart } from 'lucide-react';

export default function StaticIconTest() {
  return (
    <div className="p-4 border rounded bg-indigo-50">
      <h3 className="text-lg font-bold mb-4">⚡ Static Icon Import Test</h3>
      
      <div className="mb-4">
        <strong>Direct Named Imports:</strong>
        <div className="flex gap-4 mt-2">
          <div className="flex flex-col items-center p-2 border rounded bg-white">
            <Home className="h-8 w-8 mb-1" />
            <span className="text-xs">Home</span>
          </div>
          
          <div className="flex flex-col items-center p-2 border rounded bg-white">
            <User className="h-8 w-8 mb-1" />
            <span className="text-xs">User</span>
          </div>
          
          <div className="flex flex-col items-center p-2 border rounded bg-white">
            <Star className="h-8 w-8 mb-1" />
            <span className="text-xs">Star</span>
          </div>
          
          <div className="flex flex-col items-center p-2 border rounded bg-white">
            <Building className="h-8 w-8 mb-1" />
            <span className="text-xs">Building</span>
          </div>
          
          <div className="flex flex-col items-center p-2 border rounded bg-white">
            <Car className="h-8 w-8 mb-1" />
            <span className="text-xs">Car</span>
          </div>
          
          <div className="flex flex-col items-center p-2 border rounded bg-white">
            <Heart className="h-8 w-8 mb-1" />
            <span className="text-xs">Heart</span>
          </div>
        </div>
      </div>
      
      <div className="text-xs text-gray-600">
        <strong>Test Result:</strong> If you can see these icons above, then lucide-react is working! 
        The issue is with our dynamic loading approach.
      </div>
    </div>
  );
}