"use client";

import WidgetContainer from "./WidgetContainer";

interface UVIndexWidgetProps {
    uvIndex: number | null;
    loading?: boolean;
    error?: string;
}

export default function UVIndexWidget({ uvIndex, loading, error }: UVIndexWidgetProps) {
    const getUVLabel = (uv: number) => {
        if (uv <= 2) return { label: "Low", color: "text-green-500", bg: "bg-green-500" };
        if (uv <= 5) return { label: "Moderate", color: "text-yellow-500", bg: "bg-yellow-500" };
        if (uv <= 7) return { label: "High", color: "text-orange-500", bg: "bg-orange-500" };
        if (uv <= 10) return { label: "Very High", color: "text-red-500", bg: "bg-red-500" };
        return { label: "Extreme", color: "text-purple-500", bg: "bg-purple-500" };
    };

    const { label, color, bg } = uvIndex !== null ? getUVLabel(uvIndex) : { label: "", color: "", bg: "" };
    const percentage = uvIndex !== null ? Math.min((uvIndex / 11) * 100, 100) : 0;

    return (
        <WidgetContainer title="Max UV Index" loading={loading} error={error}>
            {uvIndex !== null && (
                <div className="flex flex-col items-center justify-center h-full gap-4">
                    <div className="relative w-32 h-32 flex items-center justify-center">
                        {/* Background Circle */}
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="64"
                                cy="64"
                                r="56"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="12"
                                className="text-gray-200 dark:text-gray-700"
                            />
                            {/* Progress Circle */}
                            <circle
                                cx="64"
                                cy="64"
                                r="56"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="12"
                                strokeDasharray={351.86}
                                strokeDashoffset={351.86 - (351.86 * percentage) / 100}
                                className={`${color} transition-all duration-1000 ease-out`}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                            <span className="text-4xl font-bold">{Math.round(uvIndex)}</span>
                            <span className={`text-sm font-medium ${color}`}>{label}</span>
                        </div>
                    </div>
                    <p className="text-sm text-center text-gray-500 dark:text-gray-400 px-4">
                        {uvIndex <= 2 ? "No protection needed." :
                            uvIndex <= 5 ? "Seek shade during midday." :
                                uvIndex <= 7 ? "Wear a hat and sunscreen." :
                                    "Avoid sun between 10AM-4PM."}
                    </p>
                </div>
            )}
        </WidgetContainer>
    );
}
