'use client';

import React, { useEffect, useState } from 'react';

import Image from 'next/image';

const SimplePrepcoLoader = () => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoaded(true);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`spl-container ${isLoaded ? 'spl-loaded' : ''}`}>
            <div className="spl-logo-wrapper">
                <Image
                    src="/logo.png"
                    alt="Prepco Logo"
                    width={120}
                    height={157}
                    className="spl-logo"
                />
                <div className="spl-tagline-text">The Right Choice for Real Peace of Mind.</div>
            </div>
        </div>
    );
};

export default SimplePrepcoLoader;