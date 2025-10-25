'use client';
import * as LucideIcons from 'lucide-react';
import {LucideIcon} from 'lucide-react';
import {LucideIconName} from "@/components/ui/Formik/FormikIconPickerField/LucideIconName";
import {useEffect, useState} from "react";

interface IconFromStringProps {
    iconName: LucideIconName | null | undefined;
    className?: string;
    fallback?: React.ReactNode;
}


export function IconFromString({
                                   iconName,
                                   className = 'h-5 w-5',
                                   fallback = null
                               }: IconFromStringProps) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        // Return a minimal placeholder during server rendering
        return <span className={className}></span>;
    }

    if (!iconName || !LucideIcons[iconName as keyof typeof LucideIcons]) {
        return fallback as React.ReactElement || null;
    }

    // Type assertion is safe here because we check if the icon exists
    const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons] as LucideIcon;
    return <IconComponent className={className} />;
}