"use client";
import { useEffect, useRef, useState } from "react";
import axios from "@/app/api/axios";
import { Map as MtMap, MapStyle, helpers, config, Marker,} from "@maptiler/sdk";
import '@maptiler/sdk/dist/maptiler-sdk.css';
import '@/app/components/RouteBuilderComponent.css'
import { RouteGeoJson } from "@/app/components/RouteBuilderComponent";
import useRouteSimulation from "./simulateRouteHook";


config.apiKey = "jgADwIPnUzhtC93OwbQm";

interface RouteNavigationProps {
    id: number;
    position: [number, number] | null;
    setPosition: (pos: [number, number]) => void;
    routeGeoJson: RouteGeoJson |  null;
    setRouteGeoJson: (geoJson: RouteGeoJson | null) => void;
    speed: number | null;
    setSpeed: (speed: number | null) => void;
}



export default function RouteNavigation (props: RouteNavigationProps) {
    const { id: routeId, position, setPosition, routeGeoJson, setRouteGeoJson, speed, setSpeed } = props;

    // const routeId = id;

    // const [position, setPosition] = useState< [number, number] | null >(null);
    // const [speed, setSpeed] = useState <number | null>(null);
    const [heading, setHeading] = useState <number | null> (null);
    // const [routeGeoJson, setRouteGeoJson] = useState <string> ("");
    const mapContainer = useRef<HTMLDivElement>(null);
    const mapRef = useRef<MtMap | null>(null);
    const markerRef = useRef<Marker | null> (null);

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
                setSpeed(pos.coords.speed);
                setHeading(pos.coords.heading);
                if (!simulating) setPosition(coords); 

            },
            (err) => {
                // TODO: do a Toast here
                console.log("Could not get location", err);
            }, 
            {enableHighAccuracy : true}
        );

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