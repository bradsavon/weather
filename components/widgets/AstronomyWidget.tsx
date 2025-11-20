"use client";

import WidgetContainer from "./WidgetContainer";
import { Sunrise, Sunset } from "lucide-react";

interface AstronomyWidgetProps {
    sunrise: string | null;
    sunset: string | null;
    loading?: boolean;
    error?: string;
}

export default function AstronomyWidget({ sunrise, sunset, loading, error }: AstronomyWidgetProps) {
    const formatTime = (isoString: string) => {
        return new Date(isoString).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    return (
        <WidgetContainer title="Sun & Moon" loading={loading} error={error}>
            {sunrise && sunset && (
                <div className="flex flex-col justify-center h-full gap-6 px-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                                <Sunrise className="w-6 h-6 text-orange-500" />
                            </div>
                            <div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">Sunrise</div>
                                <div className="text-xl font-bold">{formatTime(sunrise)}</div>
                            </div>
                        </div>
                    </div>

                    <div className="relative h-12 w-full overflow-hidden">
                        {/* Simple visual representation of an arc */}
                        <div className="absolute top-0 left-0 w-full h-24 border-t-2 border-dashed border-gray-300 dark:border-gray-600 rounded-[50%]" />
                        <div className="absolute top-[-6px] left-1/2 transform -translate-x-1/2 w-3 h-3 bg-yellow-500 rounded-full shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex-1" /> {/* Spacer */}
                        <div className="flex items-center gap-3 text-right">
                            <div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">Sunset</div>
                                <div className="text-xl font-bold">{formatTime(sunset)}</div>
                            </div>
                            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
                                <Sunset className="w-6 h-6 text-indigo-500" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </WidgetContainer>
    );
}
