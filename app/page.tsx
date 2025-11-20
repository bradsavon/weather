"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Weather from "@/components/Weather";
import MapWrapper from "@/components/MapWrapper";
import LocationSelector from "@/components/LocationSelector";
import AddLocationModal from "@/components/AddLocationModal";
import { useState, useEffect } from "react";
import { Loader2, Settings } from "lucide-react";
import WidgetsGrid from "@/components/widgets/WidgetsGrid";
import { useTheme } from "@/components/ThemeProvider";

type TemperatureUnit = "FAHRENHEIT" | "CELSIUS";

interface Location {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  isDefault: boolean;
}

export default function Home() {
  const { data: session } = useSession();
  const { setTheme } = useTheme();
  const [currentCoords, setCurrentCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [temperatureUnit, setTemperatureUnit] = useState<TemperatureUnit>("FAHRENHEIT");
  const [showAddModal, setShowAddModal] = useState(false);
  const [widgetPreferences, setWidgetPreferences] = useState({
    hourly: true,
    precipitation: true,
    uv: true,
    wind: true,
    airQuality: true,
    astronomy: true
  });

  // Get display coordinates (either selected location or current location)
  const displayCoords = selectedLocation
    ? { latitude: selectedLocation.latitude, longitude: selectedLocation.longitude }
    : currentCoords;

  useEffect(() => {
    if (session) {
      const loadData = async () => {
        try {
          // 1. Fetch Preferences
          const prefRes = await fetch("/api/preferences");
          if (prefRes.ok) {
            const data = await prefRes.json();
            if (data.temperatureUnit) setTemperatureUnit(data.temperatureUnit);
            if (data.theme) setTheme(data.theme);
            if (data.widgetPreferences) {
              try {
                setWidgetPreferences(JSON.parse(data.widgetPreferences));
              } catch (e) {
                console.error("Failed to parse widget preferences", e);
              }
            }
          }

          // 2. Fetch Locations
          const locRes = await fetch("/api/locations");
          let savedLocations: Location[] = [];
          if (locRes.ok) {
            savedLocations = await locRes.json();
            setLocations(savedLocations);
          }

          // 3. Determine Location to Use
          // Priority: 
          // 1. Manually selected location (from localStorage)
          // 2. Default location (from DB)
          // 3. Current Location (Geolocation)

          const savedLocationId = localStorage.getItem("selectedLocationId");
          const manuallySelectedLocation = savedLocations.find(loc => loc.id === savedLocationId);
          const defaultLocation = savedLocations.find(loc => loc.isDefault);

          if (savedLocationId === "current") {
            // User explicitly selected "Current Location" previously
            fetchGeolocation();
          } else if (manuallySelectedLocation) {
            setSelectedLocation(manuallySelectedLocation);
            setLoading(false);
          } else if (defaultLocation) {
            setSelectedLocation(defaultLocation);
            setLoading(false);
          } else {
            fetchGeolocation();
          }
        } catch (error) {
          console.error("Failed to load initial data", error);
          setError("Failed to load application data");
          setLoading(false);
        }
      };

      loadData();
    }
  }, [session]);

  const fetchGeolocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentCoords({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setSelectedLocation(null); // Ensure no location is selected
          setLoading(false);
        },
        (err) => {
          console.error("Geolocation error:", err);
          setError("Location access denied. Please add a location manually.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported. Please add a location manually.");
      setLoading(false);
    }
  };

  const handleLocationSelect = (location: Location | null) => {
    if (location) {
      setSelectedLocation(location);
      localStorage.setItem("selectedLocationId", location.id);
    } else {
      setLoading(true);
      setSelectedLocation(null);
      localStorage.setItem("selectedLocationId", "current");
      fetchGeolocation();
    }
  };

  const handleAddLocation = async (name: string, latitude: number, longitude: number) => {
    try {
      const res = await fetch("/api/locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, latitude, longitude, isDefault: locations.length === 0 })
      });

      if (res.ok) {
        const newLocation = await res.json();
        setLocations([...locations, newLocation]);
        if (locations.length === 0) {
          setSelectedLocation(newLocation);
        }
      }
    } catch (error) {
      console.error("Failed to add location", error);
    }
  };

  const handleDeleteLocation = async (id: string) => {
    try {
      const res = await fetch(`/api/locations?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setLocations(locations.filter(loc => loc.id !== id));
        if (selectedLocation?.id === id) {
          setSelectedLocation(null);
        }
      }
    } catch (error) {
      console.error("Failed to delete location", error);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const res = await fetch("/api/locations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isDefault: true })
      });

      if (res.ok) {
        setLocations(locations.map(loc => ({
          ...loc,
          isDefault: loc.id === id
        })));
      }
    } catch (error) {
      console.error("Failed to set default location", error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col p-6 w-full">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex mx-auto">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Weather App
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          {session ? (
            <div className="flex gap-4 items-center">
              <Link
                href="/settings"
                className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
              >
                <Settings className="w-4 h-4" />
                Settings
              </Link>
              <button
                onClick={() => signOut()}
                className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full mt-8">
        {session ? (
          <div className="flex flex-col items-center gap-8 w-full max-w-7xl">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">Welcome, {session.user?.name || session.user?.email}</h1>
              <LocationSelector
                locations={locations}
                selectedLocation={selectedLocation}
                currentLocation={currentCoords}
                onSelectLocation={handleLocationSelect}
                onAddLocation={() => setShowAddModal(true)}
                onDeleteLocation={handleDeleteLocation}
                onSetDefault={handleSetDefault}
              />
            </div>

            {loading ? (
              <Loader2 className="w-8 h-8 animate-spin" />
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : displayCoords ? (
              <div className="flex flex-col gap-8 w-full">
                <div className="flex flex-col md:flex-row gap-8 items-start w-full">
                  <div className="flex-1 w-full">
                    <Weather latitude={displayCoords.latitude} longitude={displayCoords.longitude} temperatureUnit={temperatureUnit} />
                  </div>
                  <div className="flex-1 w-full">
                    <MapWrapper latitude={displayCoords.latitude} longitude={displayCoords.longitude} />
                  </div>
                </div>

                <WidgetsGrid
                  latitude={displayCoords.latitude}
                  longitude={displayCoords.longitude}
                  temperatureUnit={temperatureUnit}
                  preferences={widgetPreferences}
                />
              </div>
            ) : null}
          </div>
        ) : (
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Welcome to Weather App</h1>
            <p className="mb-8">Please sign in to view the weather for your location.</p>
            <Link
              href="/login"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>

      <AddLocationModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddLocation}
      />
    </div>
  );
}
