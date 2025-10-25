'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, ChevronDown } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import {LucideIconName} from "@/components/ui/Formik/FormikIconPickerField/LucideIconName";

interface SimpleIconPickerProps {
    value: LucideIconName | null;
    onChange: (icon: LucideIconName) => void;
    className?: string;
}

export default function SimpleIconPicker({
                                             value,
                                             onChange,
                                             className = ''
                                         }: SimpleIconPickerProps) {
    const [isClient, setIsClient] = useState(false);
    const [open, setOpen] = useState<boolean>(false);
    const [search, setSearch] = useState<string>('');
    const ref = useRef<HTMLDivElement | null>(null);

    // Client-side only rendering
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Only process icons on client side
    const iconList = isClient 
        ? Object.keys(LucideIcons)
            .filter((key): key is LucideIconName =>
                key !== 'createLucideIcon' && key !== 'default'
            )
            .sort()
        : [];

    const filteredIcons = isClient 
        ? iconList.filter(icon =>
            icon.toLowerCase().includes(search.toLowerCase())
          )
        : [];

    // Close dropdown when clicking outside
    useEffect(() => {
        if (!isClient) return;

        const handleClickOutside = (event: Event) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isClient]);

    // Show placeholder during SSR
    if (!isClient) {
        return (
            <div className={`relative ${className}`}>
                <div className="flex items-center justify-between w-full p-2 border rounded-md bg-white">
                    <span className="text-gray-500">Loading...</span>
                </div>
            </div>
        );
    }

    const IconComponent = value ? (LucideIcons[value] as LucideIcon) : null;

    return (
        <div className={`relative ${className}`} ref={ref}>
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="flex items-center justify-between w-full p-2 border rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <div className="absolute z-50 mt-1 w-72 p-3 bg-white border rounded-md shadow-lg max-h-80 overflow-auto">
                    {/* Search input */}
                    <div className="relative mb-3">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search icons..."
                            className="w-full pl-8 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            autoFocus
                        />
                        {search && (
                            <X
                                className="absolute right-2 top-2.5 h-4 w-4 text-gray-500 cursor-pointer hover:text-gray-700"
                                onClick={() => setSearch('')}
                            />
                        )}
                    </div>

                    {/* Icon grid */}
                    <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto">
                        {filteredIcons.length > 0 ? (
                            filteredIcons.map(icon => {
                                const Icon = LucideIcons[icon] as LucideIcon;
                                return (
                                    <button
                                        key={icon}
                                        type="button"
                                        onClick={() => {
                                            onChange(icon);
                                            setOpen(false);
                                            setSearch('');
                                        }}
                                        className={`p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 flex flex-col items-center justify-center text-xs transition-colors ${
                                            value === icon ? 'bg-blue-100 ring-2 ring-blue-200' : ''
                                        }`}
                                        title={icon}
                                    >
                                        <Icon className="h-5 w-5 mb-1" />
                                        <span className="truncate w-full text-center">{icon}</span>
                                    </button>
                                );
                            })
                        ) : (
                            <div className="col-span-4 text-center py-4 text-gray-500">
                                {search ? `No icons found for "${search}"` : 'Loading icons...'}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}