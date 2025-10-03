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

interface RouteSteps {
    distance: number,
    duration: number,
    type: number,
    instruction: string,
    name: string,
    way_points: number[],
}

interface RouteSegment {
    distance: number,
    duration: number,
    steps: RouteSteps[],
}

interface RouteSummary {
    distance: number,
    duration: number,
}

interface RouteProperties {
    segments: RouteSegment[];
    way_points: number[];
    summary: RouteSummary;
}

type RouteGeoJson = FeatureCollection<Geometry, RouteProperties>;

// read-only
interface RouteViewerProps {
    routeGeoJson: RouteGeoJson | null;
}

// read&write
interface RouteBuilderProps extends RouteViewerProps {
    setRouteGeoJson: React.Dispatch<React.SetStateAction< RouteGeoJson | null>>,
}




const RouteParentComponent: React.FC = () => {
    const [routeGeoJson, setRouteGeoJson] = useState<  RouteGeoJson | null >(null);

    return (
        <>
        <RouteBuilderComponent routeGeoJson={routeGeoJson} setRouteGeoJson={setRouteGeoJson} />
        <RouteInfoComponent routeGeoJson={routeGeoJson} />
        </>
    )
}

const RouteInfoComponent = ({routeGeoJson} : RouteViewerProps) => {
    const summary = routeGeoJson?.features[0].properties.summary;
    console.log(routeGeoJson);
    const distance = summary?.distance;
    const duration = summary?.duration;
    return (
        <div>
            <p style={{color :"black"}}>Distance: {distance}m</p>
            <p style={{color : "black"}}>Duration: {duration}s</p>
        </div>
    )
}


const RouteBuilderComponent: React.FC<RouteBuilderProps> = ({routeGeoJson, setRouteGeoJson}) => {
    // refs for map container, map instance, markers, polyline
    const mapContainer = useRef<HTMLDivElement>(null);
    const mapRef = useRef<MtMap | null>(null);
    const markersRef = useRef<Map<number, Marker>>(new Map());
    const polylineRef = useRef<unknown | null>(null);

    // state for stops and routeGeoJson
    const [stops, setStops] = useState<Stop[]>([]);
    

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

export default RouteParentComponent;


