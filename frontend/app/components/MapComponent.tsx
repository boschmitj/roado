"use client";

import React, { useEffect, useRef } from "react";
import { Map, MapStyle, config } from "@maptiler/sdk";
import "../map/mapstyle.css"; // importing my "mapstyle.css" for styling

config.apiKey = "jgADwIPnUzhtC93OwbQm" // API for MapTiler FIXME: temporary

const MapComponent: React.FC = () => {
    const mapContainer = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (mapContainer.current) {
            const map = new Map({
                container: mapContainer.current,
                style: MapStyle.OUTDOOR,
                center: [11.3662, 50.6493], // Breitengrad, Längengrad 
                zoom: 10,
            });
        }
    }, []);

    return <div id="map" ref={mapContainer} />;
};

export default MapComponent;
