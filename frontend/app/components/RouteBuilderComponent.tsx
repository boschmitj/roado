"use client";


import React, { useState, useEffect, useRef } from "react";
import { Map, MapStyle, helpers } from "@maptiler/sdk";

// interface RouteGeoJson {

// }

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
            });
        }
    });

    useEffect(() => {
        if (stops.length > 1) {
            const fetchRoute = async () => {
                try {
                    const coordsParam = stops.map(([lng, lat]) => `${lng},${lat}`).join('|');
                    const response = await fetch("http:localhost/route/calcRouteGeoJson", {
                        method: 'POST',
                        'body' : coordsParam,
                    });
                    if (!response.ok) {
                        throw new Error("An error occured: " + response.status);
                    }
                    const routeGeoJson = await response.json();
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