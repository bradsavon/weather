"use client";

import WidgetContainer from "./WidgetContainer";
import { Navigation } from "lucide-react";

interface WindWidgetProps {
    speed: number | null;
    direction: number | null;
    gusts: number | null;
    unit: string;
    loading?: boolean;
    error?: string;
}

export default function WindWidget({ speed, direction, gusts, unit, loading, error }: WindWidgetProps) {
    const getDirectionLabel = (deg: number) => {
        const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
        return directions[Math.round(deg / 45) % 8];
    };

    return (
        <WidgetContainer title="Wind" loading={loading} error={error}>
            {speed !== null && direction !== null && (
                <div className="flex flex-col items-center justify-center h-full gap-6">
                    <div className="relative w-24 h-24 border-4 border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center">
                        <div className="absolute top-0 text-xs font-bold text-gray-400">N</div>
                        <div className="absolute bottom-0 text-xs font-bold text-gray-400">S</div>
                        <div className="absolute left-0 text-xs font-bold text-gray-400 pl-1">W</div>
                        <div className="absolute right-0 text-xs font-bold text-gray-400 pr-1">E</div>

                        <Navigation
                            className="w-10 h-10 text-blue-500 transition-transform duration-700 ease-out"
                            style={{ transform: `rotate(${direction}deg)` }}
                            fill="currentColor"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-center">
                        <div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Speed</div>
                            <div className="text-xl font-bold">{speed} <span className="text-sm font-normal">{unit}</span></div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Direction</div>
                            <div className="text-xl font-bold">{getDirectionLabel(direction)}</div>
                        </div>
                        {gusts !== null && (
                            <div className="col-span-2 pt-2 border-t dark:border-gray-700 mt-2">
                                <div className="text-sm text-gray-500 dark:text-gray-400">Gusts</div>
                                <div className="text-lg font-semibold">{gusts} <span className="text-sm font-normal">{unit}</span></div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </WidgetContainer>
    );
}
