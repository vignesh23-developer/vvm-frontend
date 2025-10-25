'use client';

import { useState, useEffect, useRef, MouseEvent } from 'react';
import { Search, X } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import {LucideIconName} from "@/components/ui/Formik/FormikIconPickerField/LucideIconName";

interface IconPickerProps {
    value: LucideIconName | null;
    onChange: (icon: LucideIconName) => void;
    className?: string;
}

export default function IconPicker({
                                       value,
                                       onChange,
                                       className = ''
                                   }: IconPickerProps) {
    // Use clientOnly pattern to avoid hydration mismatch
    const [isClient, setIsClient] = useState(false);
    const [open, setOpen] = useState<boolean>(false);
    const [search, setSearch] = useState<string>('');
    const ref = useRef<HTMLDivElement | null>(null);

    // Use useEffect to set isClient to true after initial render
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Get all available icons from lucide-react
    const iconList = Object.keys(LucideIcons)
        .filter((key): key is LucideIconName =>
            key !== 'createLucideIcon' && key !== 'default'
        )
        .sort();

    // Filter icons based on search term
    const filteredIcons = iconList.filter(icon =>
        icon.toLowerCase().includes(search.toLowerCase())
    );

    // Close dropdown when clicking outside
    useEffect(() => {
        if (!isClient) return; // Skip on server or during hydration

        const handleClickOutside = (event: MouseEvent | any) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        // Using any here because the MouseEvent type from React doesn't match the DOM event type
        document.addEventListener('mousedown', handleClickOutside as any);
        return () => document.removeEventListener('mousedown', handleClickOutside as any);
    }, [ref, isClient]);

    // Convert string icon name to actual icon component
    // Type assertion is safe here because we've filtered the keys to only include valid icon names
    const IconComponent = value ? (LucideIcons[value] as LucideIcon) : null;

    // If we're not on the client yet, render a minimal version to avoid hydration issues
    if (!isClient) {
        return (
            <div className={`relative ${className}`}>
                <button
                    type="button"
                    className="flex items-center justify-between w-full p-2 border rounded-md bg-white"
                    aria-label="Icon picker (loading)"
                >
                    <div className="flex items-center gap-2">
                        <span className="text-gray-500">Select an icon</span>
                    </div>
                </button>
            </div>
        );
    }

    return (
        <div className={`relative ${className}`} ref={ref}>
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="flex items-center justify-between w-full p-2 border rounded-md bg-white"
            >
                <div className="flex items-center gap-2">
                    {value ? (
                        <>
                            {IconComponent && <IconComponent className="h-5 w-5" />}
                            <span>{value}</span>
                        </>
                    ) : (
                        <span className="text-gray-500">Select an icon</span>
                    )}
                </div>
            </button>

            {open && (
                <div className="absolute z-50 mt-1 w-72 max-w-[90vw] p-3 bg-white border rounded-md shadow-lg max-h-80 overflow-auto">
                    {/* Search input */}
                    <div className="relative mb-3">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search icons..."
                            className="w-full pl-8 p-2 border rounded-md"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        {search && (
                            <X
                                className="absolute right-2 top-2.5 h-4 w-4 text-gray-500 cursor-pointer hover:text-gray-700"
                                onClick={() => setSearch('')}
                            />
                        )}
                    </div>

                    {/* Icon grid */}
                    <div className="grid grid-cols-4 gap-2">
                        {filteredIcons.length > 0 ? (
                            filteredIcons.map(icon => {
                                // Type assertion is safe here because we've filtered the keys
                                const Icon = LucideIcons[icon] as LucideIcon;
                                return (
                                    <button
                                        key={icon}
                                        type="button"
                                        onClick={() => {
                                            onChange(icon);
                                            setOpen(false);
                                        }}
                                        className={`p-2 rounded-md hover:bg-gray-100 flex flex-col items-center justify-center text-xs ${
                                            value === icon ? 'bg-blue-100 ring-2 ring-blue-200' : ''
                                        }`}
                                    >
                                        <Icon className="h-5 w-5 mb-1" />
                                        <span className="truncate w-full text-center">{icon}</span>
                                    </button>
                                );
                            })
                        ) : (
                            <div className="col-span-4 text-center py-2 text-gray-500">
                                No icons found
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

