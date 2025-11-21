"use client";

import React, { useEffect, useRef } from "react";
import { Map, MapStyle, config, helpers } from "@maptiler/sdk";
import "../map/mapstyle.css"; // importing my "mapstyle.css" for styling
import axios from "../api/axios";
config.apiKey = "jgADwIPnUzhtC93OwbQm" // API for MapTiler FIXME: temporary

const MapComponent: React.FC = () => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const mapRef = useRef<Map | null>(null);
    useEffect(() => {
        if (mapContainer.current && !mapRef.current) {
            mapRef.current = new Map({
                container: mapContainer.current,
                style: MapStyle.OUTDOOR,
                center: [11.3662, 50.6493], // Breitengrad, Längengrad 
                zoom: 10,
            });   
        }

        //just for testing
        mapRef.current?.on("load", async () => {
            try {
                const response = await axios.get("/route/routeGeoJson?id=1");
                if (response.status !== 200) {
                    throw new Error("Network response was not ok");
                }
                const routeGeoJson = await response.data;

                await helpers.addPolyline(mapRef.current!, {
                    data: routeGeoJson,
                    outline: true,
                    outlineWidth: 3,
                    lineWidth: 3,
                    outlineColor: "#ff0000",
                })
            } catch (error) {
                console.error("Error fetching route GeoJSON:", error);
            }
        });
    }, []);

    

    return <div id="map" ref={mapContainer} />;
};

export default MapComponent;
