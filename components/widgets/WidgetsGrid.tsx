"use client";

import { useState, useEffect } from "react";
import HourlyForecast from "./HourlyForecast";
import PrecipitationWidget from "./PrecipitationWidget";
import UVIndexWidget from "./UVIndexWidget";
import WindWidget from "./WindWidget";
import AirQualityWidget from "./AirQualityWidget";
import AstronomyWidget from "./AstronomyWidget";

interface WidgetsGridProps {
    latitude: number;
    longitude: number;
    temperatureUnit: "FAHRENHEIT" | "CELSIUS";
    preferences: {
        hourly: boolean;
        precipitation: boolean;
        uv: boolean;
        wind: boolean;
        airQuality: boolean;
        astronomy: boolean;
    };
}

export default function WidgetsGrid({ latitude, longitude, temperatureUnit, preferences }: WidgetsGridProps) {
    const [weatherData, setWeatherData] = useState<any>(null);
    const [aqiData, setAqiData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const unit = temperatureUnit === "CELSIUS" ? "celsius" : "fahrenheit";
    const speedUnit = temperatureUnit === "CELSIUS" ? "kmh" : "mph"; // Open-Meteo defaults
    const unitSymbol = temperatureUnit === "CELSIUS" ? "°C" : "°F";

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch Weather Data
                const weatherRes = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,precipitation_probability,weathercode&daily=uv_index_max,sunrise,sunset&current=wind_speed_10m,wind_direction_10m,wind_gusts_10m&temperature_unit=${unit}&wind_speed_unit=${speedUnit}&timezone=auto`
                );
                const weather = await weatherRes.json();
                setWeatherData(weather);

                // Fetch Air Quality Data
                if (preferences.airQuality) {
                    const aqiRes = await fetch(
                        `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=us_aqi&timezone=auto`
                    );
                    const aqi = await aqiRes.json();
                    setAqiData(aqi);
                }
            } catch (err) {
                console.error(err);
                setError("Failed to load widget data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [latitude, longitude, unit, speedUnit, preferences.airQuality]);

    if (!Object.values(preferences).some(Boolean)) {
        return null;
    }

    return (
        <div className="flex flex-col gap-6 w-full">
            {preferences.hourly && (
                <HourlyForecast
                    data={weatherData?.hourly}
                    loading={loading}
                    error={error}
                    unitSymbol={unitSymbol}
                />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {preferences.precipitation && (
                    <PrecipitationWidget
                        data={weatherData?.hourly}
                        loading={loading}
                        error={error}
                    />
                )}

                {preferences.uv && (
                    <UVIndexWidget
                        uvIndex={weatherData?.daily?.uv_index_max?.[0] ?? null}
                        loading={loading}
                        error={error}
                    />
                )}

                {preferences.wind && (
                    <WindWidget
                        speed={weatherData?.current?.wind_speed_10m ?? null}
                        direction={weatherData?.current?.wind_direction_10m ?? null}
                        gusts={weatherData?.current?.wind_gusts_10m ?? null}
                        unit={speedUnit === "mph" ? "mph" : "km/h"}
                        loading={loading}
                        error={error}
                    />
                )}

                {preferences.astronomy && (
                    <AstronomyWidget
                        sunrise={weatherData?.daily?.sunrise?.[0] ?? null}
                        sunset={weatherData?.daily?.sunset?.[0] ?? null}
                        loading={loading}
                        error={error}
                    />
                )}

                {preferences.airQuality && (
                    <AirQualityWidget
                        aqi={aqiData?.current?.us_aqi ?? null}
                        loading={loading}
                        error={error}
                    />
                )}
            </div>
        </div>
    );
}
