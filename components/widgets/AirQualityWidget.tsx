"use client";

import WidgetContainer from "./WidgetContainer";

interface AirQualityWidgetProps {
    aqi: number | null;
    loading?: boolean;
    error?: string;
}

export default function AirQualityWidget({ aqi, loading, error }: AirQualityWidgetProps) {
    const getAQILabel = (aqi: number) => {
        if (aqi <= 50) return { label: "Good", color: "text-green-500", bg: "bg-green-500", desc: "Air quality is satisfactory." };
        if (aqi <= 100) return { label: "Moderate", color: "text-yellow-500", bg: "bg-yellow-500", desc: "Acceptable quality." };
        if (aqi <= 150) return { label: "Unhealthy for Sensitive Groups", color: "text-orange-500", bg: "bg-orange-500", desc: "Sensitive groups should reduce exertion." };
        if (aqi <= 200) return { label: "Unhealthy", color: "text-red-500", bg: "bg-red-500", desc: "Public may experience health effects." };
        if (aqi <= 300) return { label: "Very Unhealthy", color: "text-purple-500", bg: "bg-purple-500", desc: "Health alert: risk of health effects for everyone." };
        return { label: "Hazardous", color: "text-rose-900", bg: "bg-rose-900", desc: "Health warning of emergency conditions." };
    };

    const { label, color, bg, desc } = aqi !== null ? getAQILabel(aqi) : { label: "", color: "", bg: "", desc: "" };
    const percentage = aqi !== null ? Math.min((aqi / 300) * 100, 100) : 0;

    return (
        <WidgetContainer title="Air Quality (AQI)" loading={loading} error={error}>
            {aqi !== null && (
                <div className="flex flex-col items-center justify-center h-full gap-4">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mt-2">
                        <div
                            className={`h-4 rounded-full ${bg} transition-all duration-1000 ease-out`}
                            style={{ width: `${percentage}%` }}
                        />
                    </div>

                    <div className="text-center">
                        <div className="text-4xl font-bold mb-1">{aqi}</div>
                        <div className={`text-lg font-semibold ${color}`}>{label}</div>
                    </div>

                    <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                        {desc}
                    </p>
                </div>
            )}
        </WidgetContainer>
    );
}
