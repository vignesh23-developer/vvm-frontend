'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import SimplePrepcoLoader from '../SimplePreLoader';

export default function LoaderManager({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false); // Tracks navigation loading state

  // Handle navigation loader logic
  useEffect(() => {
    setIsLoading(true); // Start loader for navigation
    const navTimeout = setTimeout(() => {
      setIsLoading(false); // Stop loader after delay
    }, 3000); // Adjust navigation delay as needed

    return () => clearTimeout(navTimeout); // Cleanup on navigation change
  }, [pathname]);

  return (
    <>
      {/* Show loader only during navigation */}
      {isLoading && <SimplePrepcoLoader />}

      {/* Render main content once loading is complete */}
      {!isLoading && children}
    </>
  );
}