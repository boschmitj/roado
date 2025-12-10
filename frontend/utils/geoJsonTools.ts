import { RouteGeoJson } from "@/app/components/RouteBuilderComponent";
import { geometry } from "@turf/turf";
import { LineString, Feature, FeatureCollection } from "geojson";
export function extractCoords(routeGeoJson : RouteGeoJson) {
    
    const geometry =  routeGeoJson.features[0].geometry as LineString
    const position = geometry.coordinates.map(p => [])

    const coords : [number, number][] = geometry.coordinates.map((p) => [p[0], p[1]]);
    return coords;
}


export function coordsToGeoJson(
    coordinates: [number, number][]
): FeatureCollection {
    const lineString: LineString = {
        type: "LineString",
        coordinates
    };

    return {
        type: "FeatureCollection",
        features: [
            {
                type: "Feature",
                geometry: lineString,
                properties: {}
            }
        ]
    };
}