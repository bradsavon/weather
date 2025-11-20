"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowLeft } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

type TemperatureUnit = "FAHRENHEIT" | "CELSIUS";
type Theme = "LIGHT" | "DARK" | "SYSTEM";

export default function SettingsPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const { setTheme: applyTheme } = useTheme();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [temperatureUnit, setTemperatureUnit] = useState<TemperatureUnit>("FAHRENHEIT");
    const [theme, setTheme] = useState<Theme>("SYSTEM");
    const [widgetPreferences, setWidgetPreferences] = useState({
        hourly: true,
        precipitation: true,
        uv: true,
        wind: true,
        airQuality: true,
        astronomy: true
    });
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!session) {
            router.push("/login");
            return;
        }

        const fetchPreferences = async () => {
            try {
                const res = await fetch("/api/preferences");
                if (res.ok) {
                    const data = await res.json();
                    setTemperatureUnit(data.temperatureUnit);
                    setTheme(data.theme);
                    applyTheme(data.theme);
                    if (data.widgetPreferences) {
                        try {
                            setWidgetPreferences(JSON.parse(data.widgetPreferences));
                        } catch (e) {
                            console.error("Failed to parse widget preferences", e);
                        }
                    }
                }
            } catch (error) {
                console.error("Failed to fetch preferences", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPreferences();
    }, [session, router, applyTheme]);

    const handleSave = async () => {
        setSaving(true);
        setMessage("");

        try {
            const res = await fetch("/api/preferences", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    temperatureUnit,
                    theme,
                    widgetPreferences,
                }),
            });

            if (res.ok) {
                setMessage("Settings saved successfully!");
                setTimeout(() => setMessage(""), 3000);
            } else {
                setMessage("Failed to save settings");
            }
        } catch (error) {
            setMessage("An error occurred");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col p-6 w-full">
            <div className="max-w-2xl mx-auto w-full">
                <Link href="/" className="flex items-center gap-2 text-blue-500 hover:underline mb-6">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </Link>

                <h1 className="text-3xl font-bold mb-8">Settings</h1>

                <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-lg flex flex-col gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Temperature Unit</label>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setTemperatureUnit("FAHRENHEIT")}
                                className={`px-4 py-2 rounded-lg ${temperatureUnit === "FAHRENHEIT"
                                    ? "bg-blue-500 text-white"
                                    : "bg-white/5 hover:bg-white/10"
                                    }`}
                            >
                                Fahrenheit (°F)
                            </button>
                            <button
                                onClick={() => setTemperatureUnit("CELSIUS")}
                                className={`px-4 py-2 rounded-lg ${temperatureUnit === "CELSIUS"
                                    ? "bg-blue-500 text-white"
                                    : "bg-white/5 hover:bg-white/10"
                                    }`}
                            >
                                Celsius (°C)
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Theme</label>
                        <div className="flex gap-4">
                            <button
                                onClick={() => {
                                    setTheme("LIGHT");
                                    applyTheme("LIGHT");
                                }}
                                className={`px-4 py-2 rounded-lg ${theme === "LIGHT"
                                    ? "bg-blue-500 text-white"
                                    : "bg-white/5 hover:bg-white/10"
                                    }`}
                            >
                                Light
                            </button>
                            <button
                                onClick={() => {
                                    setTheme("DARK");
                                    applyTheme("DARK");
                                }}
                                className={`px-4 py-2 rounded-lg ${theme === "DARK"
                                    ? "bg-blue-500 text-white"
                                    : "bg-white/5 hover:bg-white/10"
                                    }`}
                            >
                                Dark
                            </button>
                            <button
                                onClick={() => {
                                    setTheme("SYSTEM");
                                    applyTheme("SYSTEM");
                                }}
                                className={`px-4 py-2 rounded-lg ${theme === "SYSTEM"
                                    ? "bg-blue-500 text-white"
                                    : "bg-white/5 hover:bg-white/10"
                                    }`}
                            >
                                System
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-4">Dashboard Widgets</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { key: "hourly", label: "Hourly Forecast" },
                                { key: "precipitation", label: "Precipitation" },
                                { key: "uv", label: "UV Index" },
                                { key: "wind", label: "Wind" },
                                { key: "airQuality", label: "Air Quality" },
                                { key: "astronomy", label: "Astronomy (Sun & Moon)" },
                            ].map(({ key, label }) => (
                                <label key={key} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={widgetPreferences[key as keyof typeof widgetPreferences]}
                                        onChange={(e) => setWidgetPreferences(prev => ({ ...prev, [key]: e.target.checked }))}
                                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span>{label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded disabled:opacity-50"
                        >
                            {saving ? "Saving..." : "Save Settings"}
                        </button>
                        {message && (
                            <span className={message.includes("success") ? "text-green-500" : "text-red-500"}>
                                {message}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
