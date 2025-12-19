import { RouteGeoJson } from "@/app/components/RouteBuilderComponent";
import { extractCoords } from "@/utils/geoJsonTools";
import { useEffect, useRef } from "react";

export default function useRouteSimulation(routeGeoJson: RouteGeoJson, setPosition: (coords: [number, number]) => void, speed = 1, simulating: boolean) {
    const indexRef = useRef(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {

        if (!simulating) return;

        if(!routeGeoJson) return;

        const coords = extractCoords(routeGeoJson);
        
        // Reset
        indexRef.current = 0;

        

        // Clear old interval if any
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        // Simulate movement
        intervalRef.current = setInterval(() => {
            const i = indexRef.current;

            if (i >= coords.length) {
                clearInterval(intervalRef.current!);
                return;
            }

            // Move the "user"
            setPosition(coords[i]);
            indexRef.current += speed; // 1 index step per tick (modify speed to skip)
        }, 1000); // Tick every second

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };

    }, [routeGeoJson, setPosition, speed, simulating]);
}
