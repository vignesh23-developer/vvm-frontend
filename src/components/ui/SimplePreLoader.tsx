'use client';

import React from 'react';

const SimplePrepcoLoader = () => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
        </div>
    );
};

export default SimplePrepcoLoader;