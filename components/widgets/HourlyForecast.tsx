"use client";

import WidgetContainer from "./WidgetContainer";
import { Cloud, Sun, CloudRain, CloudSnow } from "lucide-react";

interface HourlyForecastProps {
    data: {
        time: string[];
        temperature_2m: number[];
        weathercode: number[];
    } | null;
    loading?: boolean;
    error?: string;
    unitSymbol: string;
}

export default function HourlyForecast({ data, loading, error, unitSymbol }: HourlyForecastProps) {
    const getWeatherIcon = (code: number, size: string = "w-6 h-6") => {
        if (code <= 3) return <Sun className={`${size} text-yellow-500`} />;
        if (code <= 48) return <Cloud className={`${size} text-gray-500`} />;
        if (code <= 67) return <CloudRain className={`${size} text-blue-500`} />;
        if (code <= 77) return <CloudSnow className={`${size} text-white`} />;
        return <Cloud className={`${size} text-gray-500`} />;
    };

    // Filter to next 24 hours starting from now
    const getNext24Hours = () => {
        if (!data) return [];

        const currentHour = new Date().getHours();
        const today = new Date().toISOString().slice(0, 10);

        // Find index of current hour
        const startIndex = data.time.findIndex(t => {
            const date = new Date(t);
            return date.getHours() === currentHour && t.startsWith(today);
        });

        if (startIndex === -1) return data.time.slice(0, 24).map((_, i) => i); // Fallback

        return Array.from({ length: 24 }, (_, i) => startIndex + i);
    };

    const indices = getNext24Hours();

    return (
        <WidgetContainer title="24-Hour Forecast" loading={loading} error={error} className="w-full">
            {data && (
                <div className="flex overflow-x-auto pb-4 gap-6 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                    {indices.map((index) => {
                        if (index >= data.time.length) return null;
                        const time = new Date(data.time[index]);
                        const isNow = index === indices[0];

                        return (
                            <div key={index} className="flex flex-col items-center gap-2 min-w-[60px]">
                                <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                    {isNow ? "Now" : time.toLocaleTimeString([], { hour: 'numeric', hour12: true })}
                                </span>
                                {getWeatherIcon(data.weathercode[index])}
                                <span className="font-bold text-lg">
                                    {Math.round(data.temperature_2m[index])}°
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
        </WidgetContainer>
    );
}
