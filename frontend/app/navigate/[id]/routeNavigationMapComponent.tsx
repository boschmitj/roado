"use client";
import { useEffect, useRef, useState } from "react";
import axios from "@/app/api/axios";
import { Map as MtMap, MapStyle, helpers, config, Marker, Feature,} from "@maptiler/sdk";
import '@maptiler/sdk/dist/maptiler-sdk.css';
import '@/app/components/RouteBuilderComponent.css'
import { RouteGeoJson } from "@/app/components/RouteBuilderComponent";
import useRouteSimulation from "./simulateRouteHook";
import { lineString, nearestPointOnLine } from "@turf/turf";
import { extractCoords } from "@/utils/geoJsonTools";
import { Step } from "./turnByTurnNavComponent";
import { Position } from "geojson";
import useRouteProgress from "@/hooks/use-routeProgress";

config.apiKey = "jgADwIPnUzhtC93OwbQm";

interface RouteNavigationProps {
    id: number;
    position: [number, number] | null;
    setPosition: (pos: [number, number]) => void;
    routeGeoJson: RouteGeoJson |  null;
    setRouteGeoJson: (geoJson: RouteGeoJson | null) => void;
    steps: Step[] | null;
    currentStepIndex: number
    speed: number | null;
    setSpeed: (speed: number | null) => void;
    isPaused: boolean;
    coords: Position[] | null;
}

enum RoutingState {
    ON_ROUTE,
    OFF_ROUTE,
    RETURNING,
}



export default function RouteNavigation (props: RouteNavigationProps) {
    const { id: routeId, position, setPosition, routeGeoJson, setRouteGeoJson, steps, currentStepIndex, setSpeed, isPaused, coords} = props;

    const [heading, setHeading] = useState <number | null> (null);
    const [routingState, setRoutingState] = useState<RoutingState | null> (null);
    const mapContainer = useRef<HTMLDivElement>(null);
    const mapRef = useRef<MtMap | null>(null);
    const markerRef = useRef<Marker | null> (null);
    const watcherRef = useRef<number | null>(null);
    const line = useRef<ReturnType<typeof lineString> | null>(null);

    useRouteProgress((coords as [number, number][]) ?? [], mapRef.current, position ?? undefined)
    
    useEffect(() => {
        if (!routeGeoJson || !coords) return;
        line.current = lineString(coords);
    }, [routeGeoJson, coords]);

    function getProjection(userLng: number, userLat: number) {
        return nearestPointOnLine(
            line.current!,
            [userLng, userLat],
            { units: "meters"},
        );
    }  

    const simulating = true;

    
    if (simulating) {
        useRouteSimulation(routeGeoJson!, setPosition, 1);
    }
    // instantiate the geolocation watcher with callback function
    useEffect(() => {
        const watcher = navigator.geolocation.watchPosition(
            (pos) => {
                const coords : [ number, number ] = [
                    pos.coords.longitude,
                    pos.coords.latitude
                ];
                if (!isPaused && pos.coords.speed) {
                    setSpeed(pos.coords.speed);
                }
                
                setHeading(pos.coords.heading);
                if (!simulating) setPosition(coords); 
                
            },
            (err) => {
                // TODO: do a Toast here
                console.log("Could not get location", err);
            }, 
            {enableHighAccuracy : true}
        );
        watcherRef.current = watcher;

        return () => navigator.geolocation.clearWatch(watcher);
    }, []);

    // fetch the routeGeoJson
    useEffect(() => {
        const fetchRoute = async () => {
            try {
                const response = await axios.get(`/route/routeGeoJson?id=${routeId}`);
                if (response.status !== 200) {
                    throw new Error("Fehler beim Laden der Route");
                }
                setRouteGeoJson(response.data);
                console.log(response.data);
            } catch (error) {
                console.log("Could not get RouteGeoJson", error)
            }
        };

        fetchRoute();
    }, [routeId]);

    // setup the map Ref plus marker
    useEffect(() => {
        // if (!position) return; // TODO: whenever position couldnt be loaded and thus error occured alert
        if (mapContainer.current && !mapRef.current) {
            mapRef.current = new MtMap({
                container: mapContainer.current,
                style: MapStyle.OUTDOOR,
                center: position ?? [-0.118092, 51.509865], // default London
                zoom: 18,
            });
        }
    }, [])

    // update/add marker and center when position changes
    useEffect(() => {
        if (!position || !mapRef.current) return;
        if (!markerRef.current) {
            markerRef.current = new Marker()
                .setLngLat(position)
                .addTo(mapRef.current);
        } else {
            markerRef.current.setLngLat(position);
        }
        mapRef.current.easeTo({ center: position, duration: 400});
        if (heading != null) {
            mapRef.current.setBearing(heading)
        }
    }, [position, heading])

    useEffect(() => {

    }, [position])


    // useEffect when routeGeoJson has changed --> fetch has been successful
    // display the rote on map
    useEffect(() => {
        if (!mapRef.current || !routeGeoJson) return;
        const map = mapRef.current;

        console.log("RouteGeoJson is: ");
        console.log(JSON.stringify(routeGeoJson));
        const addPolylne = () => helpers.addPolyline(map, {
            data: routeGeoJson,
            layerId: "route-line",
            outline: true,
            outlineWidth: 6,
            lineWidth: 3,
            outlineColor: "#ff00b3ff",
            outlineBlur: 10,
            lineColor: "#ffffff",
        })

        if (map.isStyleLoaded()) {
            addPolylne();
        } else {
            const onLoad = () => {
                addPolylne();
                map.off('load', onLoad);
            };
            map.on('load', onLoad);
        }

    }, [routeGeoJson])

    return <div id="map-container" ref={mapContainer} style={{ width: "70%", height: "80vh" }}/>;

}


