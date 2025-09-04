"use client";

import React, { useEffect, useRef } from "react";
import { Map, MapStyle, config, helpers } from "@maptiler/sdk";

import "@maptiler/sdk/dist/maptiler-sdk.css"; // importing the CSS for simple map navigation
import "../map/mapstyle.css"; // importing my "mapstyle.css" for styling

// imports for geocoding control
import { GeocodingControl } from "@maptiler/geocoding-control/maptilersdk";
import "@maptiler/geocoding-control/style.css";




config.apiKey = "jgADwIPnUzhtC93OwbQm" // API for MapTiler FIXME: temporary


const MapComponent: React.FC = () => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const mapRef = useRef<Map | null>(null);

    useEffect(() => {
        if (mapContainer.current && !mapRef.current) { // initialize map only once
            mapRef.current = new Map({ // new map instance with properties
                container: mapContainer.current,
                style: MapStyle.OUTDOOR,
                center: [11.3662, 50.6493], // Breitengrad, Längengrad 
                zoom: 10,
            });   

            // Add GeocodingControl to the map
            const gc = new GeocodingControl({
                limit: 5, // Limit the number of results
                placeholder: "Search for a place",
                proximity: [{ type: "map-center"}], // results near the map center show up first
            });
            mapRef.current.addControl(gc, "top-left");
        

            //just for testing
            mapRef.current?.on("load", async () => {
                try {
                    const response = await fetch("http://localhost:8080/route/routeGeoJson?id=1");
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    const routeGeoJson = await response.json();

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

        }  
    }, []);


    return <div id="map" ref={mapContainer} />;
};

export default MapComponent;
