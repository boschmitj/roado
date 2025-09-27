"use client";


import React, { useState, useEffect, useRef } from "react";
import { Map as MtMap, MapStyle, helpers, config, Marker,} from "@maptiler/sdk";
import { FeatureCollection, Geometry, GeoJsonProperties } from "geojson";

import '@maptiler/sdk/dist/maptiler-sdk.css';

config.apiKey = "jgADwIPnUzhtC93OwbQm"

// innterface used for the stops state
interface Stop {
    id: number,
    coordinates: [number, number],
}

const RouteBuilderComponent: React.FC = () => {
    // refs for map container, map instance, markers, polyline
    const mapContainer = useRef<HTMLDivElement>(null);
    const mapRef = useRef<MtMap | null>(null);
    const markersRef = useRef<Map<number, Marker>>(new Map());
    const polylineRef = useRef<any>(null);

    // state for stops and routeGeoJson
    const [stops, setStops] = useState<Stop[]>([]);
    const [routeGeoJson, setRouteGeoJson] = useState<string | FeatureCollection<Geometry, GeoJsonProperties> | null >(null);
    

    function removeMarker(id: number) {
        markersRef.current.get(id)?.remove();
        setStops((prev) => prev.filter((stop) => stop.id !== id));
        markersRef.current.delete(id);
        console.log("Removed marker with id " + id);
    }   
    
    // effect which runs once to initialize map, set up click handler to add marker
    useEffect(() => {
        if (mapContainer.current && !mapRef.current) {
            console.log("Initializing map");
            
            mapRef.current = new MtMap({
                container: mapContainer.current,
                style: MapStyle.OUTDOOR,
                center: [11, 50],
                zoom: 3,
            });

            mapRef.current.on("click", (e) => {
                const {lng, lat} = e.lngLat;
                const id = Date.now();
                
                setStops((prev) => [...prev, { id, coordinates: [lng, lat]}]);
                console.log("Clicked on the map on point " + lng + ", " + lat);
                const marker: Marker = new Marker()
                    .setLngLat([lng, lat])
                    .addTo(mapRef.current!);

                

                marker.getElement().addEventListener("click", (e) => {
                    e.stopPropagation(); // prevents map click
                    console.log("This marker was clicked!", marker);
                    removeMarker(id);
                });
                    

                markersRef.current.set(id, marker);
                
            });
        }
        


    }, []);


    // effect which runs when stops changes to fetch new routeGeoJson
    useEffect(() => {
        if (stops.length < 2) {
            setRouteGeoJson(null); 
            console.log("Not enough stops to calculate a route:", routeGeoJson);
            return;
        }
        if (stops.length > 1) {
            const fetchRoute = async () => {
                try {
                    
                    const coordinates = stops.map(stop => stop.coordinates);
                    console.log(JSON.stringify(coordinates));
                    const response = await fetch("http://localhost:8080/route/calcRouteGeoJson", {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json",
                        },
                        'body' : JSON.stringify({coordinates}),
                    });
                    if (!response.ok) {
                        throw new Error("An error occured: " + response.status);
                    }
                    const routeGeoJson = await response.json();
                    console.log(routeGeoJson);
                    console.log(`Fetched the following route ${JSON.stringify(routeGeoJson)}`);
                    setRouteGeoJson(routeGeoJson);
                } catch (err) {
                    console.error(err);
                }
            };
            fetchRoute();
        }
    }, [stops]);


    // effect which runs when routeGeoJson changes to update polyline on map
    // removes oold polyline and adds new one
    useEffect(() => {
        if(!mapRef.current) return;

        // remove old polyline if it exists
        ["route-line", "route-line_outline"].forEach((layerId) => {
            if (mapRef.current!.getLayer(layerId)) {
                mapRef.current!.removeLayer(layerId);
            }
            if (mapRef.current!.getSource(layerId)) {
                mapRef.current!.removeSource(layerId);
            }
        });
        
        if(stops.length > 1 && routeGeoJson) {
            // create a new polyline if there are at least 2 stops
            // works because new polyline is created after each update to stops/routeGeoJson
            // and old polyline is removed above
            polylineRef.current = helpers.addPolyline(mapRef.current, {
                data: routeGeoJson,
                layerId: "route-line",
                outline: true,
                outlineWidth: 6,
                lineWidth: 3,
                outlineColor: "#ff00b3ff",
                outlineBlur: 10,
                lineColor: "#ffffff",
            });

            
        } else {
            polylineRef.current = null;
        }


    }, [routeGeoJson, stops]);

    // render the map container, which the map refers to on initialization
    return <div id="map-container" ref={mapContainer} />;


};

export default RouteBuilderComponent;


