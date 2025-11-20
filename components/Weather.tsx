"use client";

import { useState, useEffect } from "react";
import { Cloud, Sun, CloudRain, CloudSnow, Loader2 } from "lucide-react";

interface WeatherProps {
    latitude: number;
    longitude: number;
    temperatureUnit?: "FAHRENHEIT" | "CELSIUS";
}

interface DailyForecast {
    time: string[];
    weathercode: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
}

interface WeatherData {
    current_weather: {
        temperature: number;
        weathercode: number;
    };
    daily: DailyForecast;
}

export default function Weather({ latitude, longitude, temperatureUnit = "FAHRENHEIT" }: WeatherProps) {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const unit = temperatureUnit === "CELSIUS" ? "celsius" : "fahrenheit";
    const unitSymbol = temperatureUnit === "CELSIUS" ? "°C" : "°F";

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const res = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&temperature_unit=${unit}&forecast_days=10`
                );
                const data = await res.json();
                setWeather(data);
            } catch (err) {
                setError("Failed to fetch weather data");
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, [latitude, longitude, unit]);

    const getWeatherIcon = (code: number, size: string = "w-16 h-16") => {
        if (code <= 3) return <Sun className={`${size} text-yellow-500`} />;
        if (code <= 48) return <Cloud className={`${size} text-gray-500`} />;
        if (code <= 67) return <CloudRain className={`${size} text-blue-500`} />;
        if (code <= 77) return <CloudSnow className={`${size} text-white`} />;
        return <Cloud className={`${size} text-gray-500`} />;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-lg flex flex-col items-center gap-8 w-full">
            {weather && (
                <>
                    <div className="flex flex-col items-center gap-2">
                        {getWeatherIcon(weather.current_weather.weathercode)}
                        <div className="text-5xl font-bold">{weather.current_weather.temperature}{unitSymbol}</div>
                        <div className="text-gray-300">Current Location</div>
                    </div>

                    <div className="w-full">
                        <h2 className="text-xl font-bold mb-4">10-Day Forecast</h2>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {weather.daily.time.map((date, index) => (
                                <div key={date} className="bg-white/5 p-4 rounded-lg flex flex-col items-center gap-2">
                                    <div className="text-sm font-medium">
                                        {new Date(date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                                    </div>
                                    {getWeatherIcon(weather.daily.weathercode[index], "w-8 h-8")}
                                    <div className="flex gap-2 text-sm">
                                        <span className="font-bold">{weather.daily.temperature_2m_max[index]}°</span>
                                        <span className="text-gray-400">{weather.daily.temperature_2m_min[index]}°</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
