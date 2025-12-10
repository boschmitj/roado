import { lineString, nearestPointOnLine, point } from "@turf/turf";
import { RefObject, useEffect, useRef, useState } from "react";
import { Map as MtMap, coordinates, helpers } from "@maptiler/sdk";
import { coordsToGeoJson } from "@/utils/geoJsonTools";

const OFF_ROUTE_THRESHOLD = 20;
const WINDOW_SIZE = 3;
const HYSTERISIS_COUNT = 3;

export default function useRouteProgress(routeCoords: [number, number][], map: MtMap | null, position?: [number, number]) {
    const [snappedIndex, setSnappedIndex] = useState<number>(0);
    const [snappedPoint, setSnappedPoint] = useState<[number, number] | null>(null);
    const [isOffRoute, setIsOffRoute] = useState<boolean>(false);
    const offRouteRef = useRef<[number, number][]>([]);
    const consecutiveRef = useRef({on: 0, off: 0});
    const completedOffRouteSegmentsRef = useRef<[number, number][]>([]);

    const completeLayerId = "route-completed";
    const remainingLayerId = "route-remaining";
    const offRouteLayerId = "off-route";

    useEffect(() => {
        if (!routeCoords?.length || !position || !map ) return;

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


        if (dist <= OFF_ROUTE_THRESHOLD) {
            consecutiveRef.current.on += 1;
            consecutiveRef.current.off = 0;
            if (consecutiveRef.current.on >= HYSTERISIS_COUNT) {
                if (isOffRoute) setIsOffRoute(false);
                setSnappedIndex(globalIndex);
                setSnappedPoint(projected);
            }
        } else {
            consecutiveRef.current.off += 1;
            consecutiveRef.current.on = 0;
            if (consecutiveRef.current.off >= HYSTERISIS_COUNT) {
                setIsOffRoute(true);
            }
        }

        const useIndex = snappedPoint ? snappedIndex : globalIndex;
        const useProjected = snappedPoint ?? projected;


        const completed = [
            ...routeCoords.slice(0, useIndex),
            useProjected
        ];

        const remaining = [
            useProjected,
            ...routeCoords.slice(useIndex + 1)
        ];

        if (isOffRoute) {
            offRouteRef.current.push(position);
// offRouteLayerId, offRouteRef.current, {color: "orange", dash: true})
            if (map.getLayer(offRouteLayerId)) map.removeLayer(offRouteLayerId);
            helpers.addPolyline(map, {
                data: coordsToGeoJson(offRouteRef.current),
                layerId: offRouteLayerId,
                lineColor: '#FFA500',
                lineWidth: 4,
                lineDashArray: "____ _ ",
                lineCap: "butt",
            });

        } else {
            if (offRouteRef.current.length) {
                completedOffRouteSegmentsRef.current.push(...offRouteRef.current);
                offRouteRef.current = [];
                
            }
            if (map.getLayer(completeLayerId)) map.removeLayer(completeLayerId);
            helpers.addPolyline(map, {
                data: coordsToGeoJson(completed),
                layerId: completeLayerId,
                lineColor: "#808080",
                lineWidth: 4,
                lineDashArray: "_ __",
                lineCap: "butt",
                outline: true,
            });
            if(map.getLayer(remainingLayerId)) map.removeLayer(remainingLayerId);
            helpers.addPolyline(map, {
                data: coordsToGeoJson(completed),
                layerId: completeLayerId,
                lineColor: "#ff00b3ff",
                lineWidth: 4,
                lineDashArray: "_ __ ___ __",
                lineCap: "butt",
            });
        }

        
    }, [position, routeCoords, snappedIndex, snappedPoint, isOffRoute])
}
