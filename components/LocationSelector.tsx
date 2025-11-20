"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { MapPin, Plus, Trash2, Star } from "lucide-react";

interface Location {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    isDefault: boolean;
}

interface LocationSelectorProps {
    locations: Location[];
    selectedLocation: Location | null;
    currentLocation: { latitude: number; longitude: number } | null;
    onSelectLocation: (location: Location | null) => void;
    onAddLocation: () => void;
    onDeleteLocation: (id: string) => void;
    onSetDefault: (id: string) => void;
}

export default function LocationSelector({
    locations,
    selectedLocation,
    currentLocation,
    onSelectLocation,
    onAddLocation,
    onDeleteLocation,
    onSetDefault
}: LocationSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + window.scrollY + 8,
                left: rect.left + window.scrollX
            });
        }
    }, [isOpen]);

    const dropdownContent = isOpen ? (
        <>
            <div className="fixed inset-0 z-[9998]" onClick={() => setIsOpen(false)} />
            <div
                className="fixed bg-white dark:bg-gray-800 rounded-lg shadow-xl z-[9999] min-w-[300px] max-h-[400px] overflow-y-auto"
                style={{
                    top: `${dropdownPosition.top}px`,
                    left: `${dropdownPosition.left}px`
                }}
            >
                <button
                    onClick={() => {
                        onSelectLocation(null);
                        setIsOpen(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 border-b dark:border-gray-700"
                >
                    <MapPin className="w-4 h-4" />
                    <span>Use Current Location</span>
                </button>

                {locations.map((location) => (
                    <div
                        key={location.id}
                        className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 border-b dark:border-gray-700"
                    >
                        <button
                            onClick={() => {
                                onSelectLocation(location);
                                setIsOpen(false);
                            }}
                            className="flex-1 text-left flex items-center gap-2"
                        >
                            {location.isDefault && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                            <span>{location.name}</span>
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onSetDefault(location.id);
                            }}
                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                            title="Set as default"
                        >
                            <Star className={`w-4 h-4 ${location.isDefault ? "text-yellow-500 fill-yellow-500" : "text-gray-400"}`} />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDeleteLocation(location.id);
                            }}
                            className="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded text-red-500"
                            title="Delete location"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}

                <button
                    onClick={() => {
                        onAddLocation();
                        setIsOpen(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-blue-500 font-medium"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Location</span>
                </button>
            </div>
        </>
    ) : null;

    return (
        <div className="relative">
            <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg hover:bg-white/20 transition-colors"
            >
                <MapPin className="w-4 h-4" />
                <span>{selectedLocation ? selectedLocation.name : "Current Location"}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {typeof window !== 'undefined' && createPortal(dropdownContent, document.body)}
        </div>
    );
}
