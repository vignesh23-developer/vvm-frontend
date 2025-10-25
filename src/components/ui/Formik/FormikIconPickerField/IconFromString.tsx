'use client';
import * as LucideIcons from 'lucide-react';
import {LucideIcon} from 'lucide-react';
import {LucideIconName} from "@/components/ui/Formik/FormikIconPickerField/LucideIconName";
import {useEffect, useState} from "react";
import dynamic from 'next/dynamic';

interface IconFromStringProps {
    iconName: LucideIconName | null | undefined;
    className?: string;
    fallback?: React.ReactNode;
}

function IconFromStringComponent({
                                     iconName,
                                     className = 'h-5 w-5',
                                     fallback = null
                                 }: IconFromStringProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Return placeholder during SSR/hydration
    if (!mounted) {
        return <span className={`${className} bg-gray-200 animate-pulse rounded`}></span>;
    }

    if (!iconName || !LucideIcons[iconName as keyof typeof LucideIcons]) {
        return fallback as React.ReactElement || null;
    }

    // Type assertion is safe here because we check if the icon exists
    const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons] as LucideIcon;
    return <IconComponent className={className} />;
}

// Use dynamic import with ssr: false to prevent hydration issues
const IconFromString = dynamic(() => Promise.resolve(IconFromStringComponent), {
    ssr: false,
    loading: () => (
        <span className="h-5 w-5 bg-gray-200 animate-pulse rounded"></span>
    )
});

export { IconFromString };