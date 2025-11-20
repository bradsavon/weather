"use client";

import dynamic from "next/dynamic";

const Map = dynamic(() => import("./Map"), { ssr: false });

interface MapWrapperProps {
    latitude: number;
    longitude: number;
}

export default function MapWrapper({ latitude, longitude }: MapWrapperProps) {
    return <Map latitude={latitude} longitude={longitude} />;
}
