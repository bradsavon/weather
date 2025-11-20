"use client";

import { ReactNode } from "react";
import { Loader2, AlertCircle } from "lucide-react";

interface WidgetContainerProps {
    title: string;
    children: ReactNode;
    loading?: boolean;
    error?: string;
    className?: string;
}

export default function WidgetContainer({
    title,
    children,
    loading = false,
    error,
    className = ""
}: WidgetContainerProps) {
    return (
        <div className={`bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg flex flex-col h-full ${className}`}>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">{title}</h3>

            {loading ? (
                <div className="flex-1 flex items-center justify-center min-h-[150px]">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
            ) : error ? (
                <div className="flex-1 flex flex-col items-center justify-center min-h-[150px] text-red-500 gap-2">
                    <AlertCircle className="w-8 h-8" />
                    <p className="text-sm text-center">{error}</p>
                </div>
            ) : (
                <div className="flex-1">
                    {children}
                </div>
            )}
        </div>
    );
}
