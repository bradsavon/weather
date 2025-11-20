"use client";

import WidgetContainer from "./WidgetContainer";

interface PrecipitationWidgetProps {
    data: {
        time: string[];
        precipitation_probability: number[];
    } | null;
    loading?: boolean;
    error?: string;
}

export default function PrecipitationWidget({ data, loading, error }: PrecipitationWidgetProps) {
    // Get next 6 hours
    const getNextHours = () => {
        if (!data) return [];

        const currentHour = new Date().getHours();
        const today = new Date().toISOString().slice(0, 10);

        const startIndex = data.time.findIndex(t => {
            const date = new Date(t);
            return date.getHours() === currentHour && t.startsWith(today);
        });

        if (startIndex === -1) return [];

        return Array.from({ length: 6 }, (_, i) => startIndex + i);
    };

    const indices = getNextHours();

    return (
        <WidgetContainer title="Precipitation Chance" loading={loading} error={error}>
            {data && (
                <div className="flex items-end justify-between h-[150px] gap-2 pt-4">
                    {indices.map((index) => {
                        if (index >= data.time.length) return null;
                        const prob = data.precipitation_probability[index];
                        const time = new Date(data.time[index]);

                        return (
                            <div key={index} className="flex flex-col items-center gap-2 flex-1 group">
                                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-t-lg relative h-[100px] flex items-end overflow-hidden">
                                    <div
                                        className="w-full bg-blue-500 transition-all duration-500 ease-out group-hover:bg-blue-400"
                                        style={{ height: `${prob}%` }}
                                    />
                                </div>
                                <span className="text-xs font-medium">{prob}%</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {time.toLocaleTimeString([], { hour: 'numeric', hour12: true })}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
        </WidgetContainer>
    );
}
