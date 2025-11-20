"use client";

import { useState } from "react";
import { X, Search, Loader2 } from "lucide-react";

interface AddLocationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (name: string, latitude: number, longitude: number) => Promise<void>;
}

interface SearchResult {
    name: string;
    latitude: number;
    longitude: number;
    country: string;
    admin1?: string;
}

export default function AddLocationModal({ isOpen, onClose, onAdd }: AddLocationModalProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [searching, setSearching] = useState(false);
    const [adding, setAdding] = useState(false);

    if (!isOpen) return null;

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        setSearching(true);
        try {
            const res = await fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchQuery)}&count=5&language=en&format=json`
            );
            const data = await res.json();

            if (data.results) {
                setSearchResults(data.results.map((result: any) => ({
                    name: result.name,
                    latitude: result.latitude,
                    longitude: result.longitude,
                    country: result.country,
                    admin1: result.admin1
                })));
            } else {
                setSearchResults([]);
            }
        } catch (error) {
            console.error("Search failed", error);
            setSearchResults([]);
        } finally {
            setSearching(false);
        }
    };

    const handleAdd = async (result: SearchResult) => {
        setAdding(true);
        try {
            const locationName = result.admin1
                ? `${result.name}, ${result.admin1}, ${result.country}`
                : `${result.name}, ${result.country}`;

            await onAdd(locationName, result.latitude, result.longitude);
            onClose();
            setSearchQuery("");
            setSearchResults([]);
        } catch (error) {
            console.error("Failed to add location", error);
        } finally {
            setAdding(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col">
                <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
                    <h2 className="text-xl font-bold">Add Location</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6">
                    <div className="flex gap-2 mb-4">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            placeholder="Search for a city..."
                            className="flex-1 px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={handleSearch}
                            disabled={searching || !searchQuery.trim()}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                        </button>
                    </div>

                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                        {searchResults.length === 0 && !searching && searchQuery && (
                            <p className="text-gray-500 text-center py-4">No results found</p>
                        )}

                        {searchResults.map((result, index) => (
                            <button
                                key={index}
                                onClick={() => handleAdd(result)}
                                disabled={adding}
                                className="w-full p-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg border dark:border-gray-600 disabled:opacity-50"
                            >
                                <div className="font-medium">{result.name}</div>
                                <div className="text-sm text-gray-500">
                                    {result.admin1 && `${result.admin1}, `}{result.country}
                                </div>
                                <div className="text-xs text-gray-400 mt-1">
                                    {result.latitude.toFixed(4)}, {result.longitude.toFixed(4)}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
