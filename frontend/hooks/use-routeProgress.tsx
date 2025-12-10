import { lineString, nearestPointOnLine, point } from "@turf/turf";
import { useEffect, useRef, useState } from "react";
import { Map as MtMap, helpers } from "@maptiler/sdk";
import { coordsToGeoJson } from "@/utils/geoJsonTools";

const OFF_ROUTE_THRESHOLD = 20;
const WINDOW_SIZE = 3;
const HYSTERISIS_COUNT = 3;

export default function useRouteProgress(
    routeCoords: [number, number][], 
    map: MtMap | null, 
    position?: [number, number]
) {
    const [snappedIndex, setSnappedIndex] = useState<number>(0);
    const [snappedPoint, setSnappedPoint] = useState<[number, number] | null>(null);
    const [isOffRoute, setIsOffRoute] = useState<boolean>(false);
    const [counterOffRoute, setCounterOffRoute] = useState<number>(0);
    
    const offRouteRef = useRef<[number, number][]>([]);
    const consecutiveRef = useRef({on: 0, off: 0});
    const completedOffRouteSegmentsRef = useRef<[number, number][]>([]);
    const lastPositionRef = useRef<string>("");

    const completeLayerId = "route-completed";
    const remainingLayerId = "route-remaining";
    const offRouteLayerId = "off-route";

    useEffect(() => {
        if (!routeCoords?.length || !position || !map) return;

        // Verhindere unnötige Updates wenn Position gleich bleibt
        const posKey = `${position[0]},${position[1]}`;
        if (posKey === lastPositionRef.current) return;
        lastPositionRef.current = posKey;

        const start = Math.max(snappedIndex - WINDOW_SIZE, 0);
        const end = Math.min(snappedIndex + WINDOW_SIZE + 1, routeCoords.length);
        const windowCoords = routeCoords.slice(start, end);

        const line = lineString(windowCoords);
        const p = point(position);
        const nearest = nearestPointOnLine(line, p, { units: "meters" });
        const dist = nearest.properties.dist;
        const localIndex = nearest.properties.index;
        const projected: [number, number] = nearest.geometry.coordinates as [number, number];
        const globalIndex = start + localIndex;


        let newSnappedIndex = snappedIndex;
        let newSnappedPoint = snappedPoint;
        let newIsOffRoute = isOffRoute;

        if (dist <= OFF_ROUTE_THRESHOLD) {
            consecutiveRef.current.on += 1;
            consecutiveRef.current.off = 0;
            
            if (consecutiveRef.current.on >= HYSTERISIS_COUNT) {
                if (isOffRoute) {
                    console.log("Was off Route, now not anymore");
                    newIsOffRoute = false;
                }
                newSnappedIndex = globalIndex;
                newSnappedPoint = projected;
            }
        } else {
            console.log("Predicting off Route.");
            console.log("Dist: " + dist + ", position: " + position[0]+","+position[1]);
            console.log("Nearest: " + nearest);
            consecutiveRef.current.off += 1;
            consecutiveRef.current.on = 0;
            
            if (consecutiveRef.current.off >= HYSTERISIS_COUNT) {
                console.log("Off Route");
                newIsOffRoute = true;
            }
        }

        // Nur updaten wenn sich was geändert hat
        if (newSnappedIndex !== snappedIndex) {
            setSnappedIndex(newSnappedIndex);
        }
        if (newSnappedPoint !== snappedPoint) {
            setSnappedPoint(newSnappedPoint);
        }
        if (newIsOffRoute !== isOffRoute) {
            setIsOffRoute(newIsOffRoute);
        }

        // Helper function für sicheres Layer-Handling
        const safeRemoveLayer = (layerId: string) => {
            if (map.getLayer(layerId)) {
                map.removeLayer(layerId);
            }
            if (map.getSource(layerId)) {
                map.removeSource(layerId);
            }
        };

        const useIndex = newSnappedPoint ? newSnappedIndex : globalIndex;
        const useProjected = newSnappedPoint ?? projected;

        const completed = [
            ...routeCoords.slice(0, useIndex),
            useProjected
        ];

        const remaining = [
            useProjected,
            ...routeCoords.slice(useIndex + 1)
        ];

        // Warte bis Map geladen ist
        if (!map.isStyleLoaded()) return;

        if (newIsOffRoute) {
            console.log("Currently off route, removing " + offRouteLayerId);
            offRouteRef.current.push(position);
            
            let currOffRouteLayerId;
            if (!counterOffRoute) {
                currOffRouteLayerId = offRouteLayerId
            }
            currOffRouteLayerId = offRouteLayerId + counterOffRoute;

            // Off-Route Layer zeichnen
            safeRemoveLayer(currOffRouteLayerId);
            helpers.addPolyline(map, {
                data: coordsToGeoJson(offRouteRef.current),
                layerId: currOffRouteLayerId,
                lineColor: '#FFA500',
                lineWidth: 4,
                lineDashArray: [4, 2],
                lineCap: "round",
            });
        } else {
            // Wenn zurück auf Route, speichere off-route Segment
            if (offRouteRef.current.length > 0) {
                completedOffRouteSegmentsRef.current.push(...offRouteRef.current);
                offRouteRef.current = [];
                setCounterOffRoute(counterOffRoute + 1);
            }

            // Gefahrene Route (completed) - grau/gestrichelt
            

            // Verbleibende Route (remaining) - pink/original
            safeRemoveLayer(remainingLayerId);
            helpers.addPolyline(map, {
                data: coordsToGeoJson(remaining),
                layerId: remainingLayerId,
                lineColor: "#9B5DE0",
                lineWidth: 4,
                lineCap: "round",
                lineBlur: 3,
            });

            safeRemoveLayer(completeLayerId);
            helpers.addPolyline(map, {
                data: coordsToGeoJson(completed),
                layerId: completeLayerId,
                lineColor: "#4E56C0",
                lineWidth: 4,
                lineDashArray: "___  _  ",
                lineCap: "round",
            });
        }

    }, [position, routeCoords, map]);

    return { snappedIndex, snappedPoint, isOffRoute };
}