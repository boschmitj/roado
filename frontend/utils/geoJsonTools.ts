import { RouteGeoJson } from "@/app/components/RouteBuilderComponent";
import { LineString } from "geojson";
export function extractCoords(routeGeoJson : RouteGeoJson) {
    
    const geometry =  routeGeoJson.features[0].geometry as LineString
    const position = geometry.coordinates.map(p => [])

    const coords : [number, number][] = geometry.coordinates.map((p) => [p[0], p[1]]);
    return coords;
}