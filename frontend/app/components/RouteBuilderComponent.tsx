"use client";


import React, { useState, useEffect, useRef } from "react";
import { Map, MapStyle, helpers, config } from "@maptiler/sdk";

// interface RouteGeoJson {

// }

config.apiKey = "jgADwIPnUzhtC93OwbQm"

const RouteBuilderComponent: React.FC = () => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const mapRef = useRef<Map | null>(null);
    const [stops, setStops] = useState<[number, number][]>([]);
    const [routeGeoJson, setRouteGeoJson] = useState<any>(null);
    
    useEffect(() => {
        if (mapContainer.current && !mapRef.current) {
            
            mapRef.current = new Map({
                container: mapContainer.current,
                style: MapStyle.OUTDOOR,
                center: [11, 50],
                zoom: 3,
            });

            mapRef.current.on("click", (e) => {
                const {lng, lat} = e.lngLat;
                setStops((prev) => [...prev, [lng, lat]]);
                console.log("Clicked on the map on point " + lng + ", " + lat);
            });
        }

    });

    useEffect(() => {
        if (stops.length > 1) {
            const fetchRoute = async () => {
                try {
                    //const coordsParam = stops.map(([lng, lat]) => `${lng},${lat}`).join(',');
                    console.log(JSON.stringify(stops));
                    const response = await fetch("http://localhost:8080/route/calcRouteGeoJson", {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json",
                        },
                        'body' : JSON.stringify({coordinates: stops}),
                    });
                    if (!response.ok) {
                        throw new Error("An error occured: " + response.status);
                    }
                    const routeGeoJson = await response.json();
                    console.log(`Fetched the following route ${routeGeoJson}`);
                    setRouteGeoJson(routeGeoJson);
                } catch (err) {
                    console.error(err);
                }
            };
            fetchRoute();
        }
    }, [stops]);


    useEffect(() => {
        if(mapRef.current && routeGeoJson) {
            helpers.addPolyline(mapRef.current, {
                data: routeGeoJson,
                outline: true,
                outlineWidth: 3,
                lineWidth: 3,
                outlineColor: "#61337dad",
            })
        }
    }, [routeGeoJson]);

    return <div ref={mapContainer} style={{width: "100%", height: "500px"}} />;

};

export default RouteBuilderComponent;