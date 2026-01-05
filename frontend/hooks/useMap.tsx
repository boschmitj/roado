"use client";

import { useEffect, useRef, useState } from "react";
import { Map as MtMap, MapStyle, helpers, config } from "@maptiler/sdk";
import { FeatureCollection, Geometry, GeoJsonProperties } from "geojson";
import '@maptiler/sdk/dist/maptiler-sdk.css';

config.apiKey = "jgADwIPnUzhtC93OwbQm";

interface RouteGeometry {
    id: number;
    geoJson: string;
}

interface UseMapOptions {
    routeGeometries: RouteGeometry[];
    center?: [number, number];
    zoom?: number;
    onCenterChange?: (center: [number, number]) => void;
}

interface UseMapReturn {
    mapContainer: React.RefObject<HTMLDivElement | null>;
    mapRef: React.RefObject<MtMap | null>;
    highlightRoute: (routeId: number | null) => void;
}

function getColorFromId(id: number): string {
    const hue = (id * 137.508) % 360; // Golden angle
    return `hsl(${hue}, 70%, 50%)`;
}

export function useMap(options: UseMapOptions = {
    routeGeometries: []
}): UseMapReturn {
    const { routeGeometries, center = [11, 50], zoom = 12, onCenterChange } = options;

    const mapContainer = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<MtMap | null>(null);
    const routeLayersRef = useRef<Map<number, string>>(new Map());
    const routeColorsRef = useRef<Map<number, string>>(new Map()); // Store colors
    const [mapLoaded, setMapLoaded] = useState(false);

    console.log("routeGeometries", routeGeometries);

    // Initialize map
    useEffect(() => {
        if (mapContainer.current && !mapRef.current) {
            mapRef.current = new MtMap({
                container: mapContainer.current,
                style: MapStyle.OUTDOOR,
                center,
                zoom,
            });

            mapRef.current.on('load', () => {
                setMapLoaded(true);
            });
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [onCenterChange]);

    useEffect(() => {
        if (mapRef.current && mapLoaded) {
            mapRef.current.flyTo({
                center: center,
            });
        }
    }, [center, mapLoaded])

    // Update route geometries on map
    useEffect(() => {
        
        if (!mapRef.current || !mapLoaded) return;
        console.log("Fired")
        const map = mapRef.current;

        // Remove all existing route layers
        routeLayersRef.current.forEach((layerId) => {
            if (map.getLayer(layerId)) map.removeLayer(layerId);
            if (map.getSource(layerId)) map.removeSource(layerId);
        });
        routeLayersRef.current.clear();

        // Add new route layers
        routeGeometries.forEach(({ id, geoJson }) => {
            const layerId = `route-${id}`;
            
            // Store color if not already stored
            if (!routeColorsRef.current.has(id)) {
                routeColorsRef.current.set(id, getColorFromId(id));
            }
            const color = routeColorsRef.current.get(id)!;

            // Add main line layer
            map.addSource(layerId, {
                type: 'geojson',
                data: JSON.parse(geoJson),
            });

            map.addLayer({
                id: layerId,
                type: 'line',
                source: layerId,
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round',
                },
                paint: {
                    'line-color': color,
                    'line-width': 3,
                },
            });

            routeLayersRef.current.set(id, layerId);
        });
    }, [routeGeometries, mapLoaded]);

    const highlightRoute = (routeId: number | null) => {
        if (!mapRef.current || !mapLoaded) return;

        const map = mapRef.current;

        routeLayersRef.current.forEach((layerId, id) => {
            const isHighlighted = routeId === id;
            
            if (map.getLayer(layerId)) {
                // Use setPaintProperty for smooth transitions without re-rendering
                map.setPaintProperty(layerId, 'line-width', isHighlighted ? 6 : 3);
            }
        });
    };

    return {
        mapContainer,
        mapRef,
        highlightRoute,
    };
}