"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, LayersControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface MapProps {
    latitude: number;
    longitude: number;
}

function MapUpdater({ latitude, longitude }: MapProps) {
    const map = useMap();

    useEffect(() => {
        map.setView([latitude, longitude], 13);
    }, [latitude, longitude, map]);

    return null;
}

export default function Map({ latitude, longitude }: MapProps) {
    const [radarPath, setRadarPath] = useState<string | null>(null);
    const [satellitePath, setSatellitePath] = useState<string | null>(null);
    const [host, setHost] = useState<string>("https://tilecache.rainviewer.com");

    useEffect(() => {
        const fetchTimestamps = async () => {
            try {
                const res = await fetch("https://api.rainviewer.com/public/weather-maps.json");
                if (res.ok) {
                    const data = await res.json();
                    if (data.host) {
                        setHost(data.host);
                    }
                    // Get the last available past path for radar
                    if (data.radar && data.radar.past && data.radar.past.length > 0) {
                        setRadarPath(data.radar.past[data.radar.past.length - 1].path);
                    }
                    // Get the last available past path for satellite
                    if (data.satellite && data.satellite.infrared && data.satellite.infrared.length > 0) {
                        setSatellitePath(data.satellite.infrared[data.satellite.infrared.length - 1].path);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch RainViewer timestamps", error);
            }
        };

        fetchTimestamps();
    }, []);

    return (
        <MapContainer
            center={[latitude, longitude]}
            zoom={13}
            scrollWheelZoom={false}
            className="h-[500px] w-full rounded-lg shadow-lg z-0"
        >
            <MapUpdater latitude={latitude} longitude={longitude} />

            <LayersControl position="topright">
                <LayersControl.BaseLayer checked name="Street Map">
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                </LayersControl.BaseLayer>

                <LayersControl.BaseLayer name="Satellite (Esri)">
                    <TileLayer
                        attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    />
                </LayersControl.BaseLayer>

                {radarPath && (
                    <LayersControl.Overlay name="Precipitation (Radar)">
                        <TileLayer
                            attribution='&copy; <a href="https://www.rainviewer.com/api.html">RainViewer</a>'
                            url={`${host}${radarPath}/256/{z}/{x}/{y}/2/1_1.png`}
                            opacity={0.7}
                        />
                    </LayersControl.Overlay>
                )}

                {satellitePath && (
                    <LayersControl.Overlay name="Cloud Cover (Satellite)">
                        <TileLayer
                            attribution='&copy; <a href="https://www.rainviewer.com/api.html">RainViewer</a>'
                            url={`${host}${satellitePath}/256/{z}/{x}/{y}/0/1_1.png`}
                            opacity={0.7}
                        />
                    </LayersControl.Overlay>
                )}
            </LayersControl>

            <Marker position={[latitude, longitude]}>
                <Popup>
                    You are here.
                </Popup>
            </Marker>
        </MapContainer>
    );
}
