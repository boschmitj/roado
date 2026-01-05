"use client";


import React, { useState, useEffect, useRef } from "react";
import { Map as MtMap, MapStyle, helpers, config, Marker,} from "@maptiler/sdk";
import { FeatureCollection, Geometry, GeoJsonProperties, Feature, LineString } from "geojson";
import Button from "../components/Button";
import Input from "../components/Input";
import {
  InputButton,
  InputButtonAction,
  InputButtonProvider,
  InputButtonSubmit,
  InputButtonInput,
} from '@/components/ui/shadcn-io/input-button';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import './RouteBuilderComponent.css'
import axios from "../api/axios";
import { generateRoutePreviewSvg } from "@/utils/routePreview";
import { computeDistanceString, computeDurationString } from "@/utils/formatter";
// import SearchAddress from "@/components/ui/search-address";
import { SearchResult } from "leaflet-geosearch/dist/providers/provider.js";
import { RawResult } from "leaflet-geosearch/dist/providers/bingProvider.js";
import dynamic from "next/dynamic";
import ElevationInfo from "@/app/types/ElevationInfo"
import RouteStatisticComponent from "./RouteStatisticComponent";
import { Mountain, MoveDownRight, MoveUpRight, RulerDimensionLine, Snail, Timer } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

export type RouteGeoJson = FeatureCollection<Geometry, RouteProperties>;

// read-only
interface RouteViewerProps {
    routeGeoJson: RouteGeoJson | null;
}

// read&write
interface RouteBuilderProps extends RouteViewerProps {
    setRouteGeoJson: React.Dispatch<React.SetStateAction< RouteGeoJson | null>>,
    selectedLocation: [number, number] | null,
}




const RouteParentComponent: React.FC = () => {
    const [routeGeoJson, setRouteGeoJson] = useState< RouteGeoJson | null >(null);
    const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);
    
    const SearchAddress = dynamic(() => import("@/components/ui/search-address"), {
        ssr: false,
    });

    const onSelectLocation = (item: SearchResult<RawResult> | null) => {
        if (item) {
            setSelectedLocation([item.x, item.y]);
        }
    }

    return (
        <div className="flex flex-col lg:flex-row h-screen w-full">
            {/* Map - Full height always on desktop, dynamic on mobile */}
            <motion.div 
                className="order-1 lg:order-2 lg:h-full overflow-hidden relative"
                animate={{
                    height: typeof window !== 'undefined' && window.innerWidth < 1024 
                        ? (routeGeoJson ? "66.666vh" : "100vh")
                        : "100%",
                    width: routeGeoJson 
                        ? (typeof window !== 'undefined' && window.innerWidth >= 1024 ? "80%" : "100%") 
                        : "100%"
                }}
                initial={{
                    height: typeof window !== 'undefined' && window.innerWidth < 1024 ? "100vh" : "100%",
                    width: "100%"
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
            >
                {/* SearchAddress positioned on top of map */}
                <div className="absolute top-4 left-4 z-10 w-80">
                    <SearchAddress onSelectLocation={onSelectLocation} />
                </div>
                
                <RouteBuilderComponent 
                    routeGeoJson={routeGeoJson} 
                    setRouteGeoJson={setRouteGeoJson} 
                    selectedLocation={selectedLocation}
                /> 
            </motion.div>
            
            {/* Sidebar - Slides in from left on desktop, from bottom on mobile */}
            <AnimatePresence>
                {routeGeoJson && (
                    <motion.div 
                        className="order-2 lg:order-1 w-full lg:w-1/5 h-auto lg:h-full overflow-y-auto bg-background border-t lg:border-t-0 lg:border-r border-border"
                        initial={{ 
                            x: typeof window !== 'undefined' && window.innerWidth >= 1024 ? -400 : 0,
                            y: typeof window !== 'undefined' && window.innerWidth < 1024 ? 400 : 0,
                            opacity: 0 
                        }}
                        animate={{ 
                            x: 0,
                            y: 0,
                            opacity: 1 
                        }}
                        exit={{ 
                            x: typeof window !== 'undefined' && window.innerWidth >= 1024 ? -400 : 0,
                            y: typeof window !== 'undefined' && window.innerWidth < 1024 ? 400 : 0,
                            opacity: 0 
                        }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                        <div className="flex flex-col gap-6 p-4 lg:p-6">
                            <RouteInfoComponent routeGeoJson={routeGeoJson} />
                            <RouteConfirmComponent routeGeoJson={routeGeoJson}/>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

const RouteInfoComponent = ({routeGeoJson} : RouteViewerProps) => {
    const summary = routeGeoJson?.features[0].properties.summary;
    const geometry = routeGeoJson?.features[0].geometry;
    const elevations = (geometry?.type === "LineString") 
        ? geometry.coordinates.map(coord => coord[2]) 
        : [];

    console.log(routeGeoJson);
    const distance = summary?.distance ?? 0;
    const duration = summary?.duration ?? 0;

    const distanceString = computeDistanceString(distance);
    const durationString = computeDurationString(duration);
    const {up, down} = computeElevationInfo(elevations);
    const speedKmH = (distance && duration) ? Math.round((distance / duration) * 3.6) + "km/h" : 0;

    return (
        <div className="flex flex-col gap-4 ">
            <RouteStatisticComponent value={distanceString} statisticName={"Distance"} icon={<RulerDimensionLine className="p-0.5"/>} />
            <RouteStatisticComponent value={durationString} statisticName="Duration" icon={<Timer className="p-0.5"/>} />
            <RouteStatisticComponent value={up + "m"} statisticName="Elevation Gain" icon={<Mountain className="p-0.5" />} furtherInfo={<><span className="flex items-center gap-1"><MoveUpRight className="size-4"/>{up}</span> <span className="flex items-center gap-1"><MoveDownRight className="size-4"/>{down}</span></>} />
            <RouteStatisticComponent value={speedKmH} statisticName="Speed" icon={<Snail className="p-0.5" />}/>
        </div>
    )
}
 

 
export const RouteNameComponent = ({onConfirm, setRouteName}: {onConfirm: () => void, setRouteName: React.Dispatch<React.SetStateAction<string>>}) => {

    return (
    <InputButtonProvider className="w-full">
        <InputButton className="w-full" onClick={onConfirm}>
        <InputButtonAction>Enter a name to create your route </InputButtonAction>
        <InputButtonSubmit className="bg-[#BBDAA4] hover:bg-[#91b476] text-zinc-800">Create Route 🚴</InputButtonSubmit>
        </InputButton>
        <InputButtonInput type="text" placeholder="Your route name" onChange={(e) => setRouteName(e.target.value)} className="w-full" />
    </InputButtonProvider>
    );
};

const RouteConfirmComponent = ({routeGeoJson} : RouteViewerProps) => {

    const [routeName, setRouteName] = useState("");
    const [showInput, setShowInput] = useState(false);


    const summary = routeGeoJson?.features[0].properties.summary;
    console.log(routeGeoJson);
    const distanceM = summary?.distance;
    const durationS = summary?.duration;
    const name = routeName;
    const geoJson = routeGeoJson;
    const elevationProfile = null;

    const geometry = routeGeoJson?.features[0].geometry;
    const elevations = (geometry?.type === "LineString") 
        ? geometry.coordinates.map(coord => coord[2]) 
        : [];
    const elevationGain = computeElevationTotal(elevations);


    const sendRoute = async () => {
        if (!routeName) {
            console.log("Route name is empty");
            return;
        } else if (!routeGeoJson) {
            console.log("No route to save");
            return;
        }
        try {
            const geom = routeGeoJson.features[0].geometry as LineString;
            const coordsForPreview = geom.coordinates.map(([lng, lat]) => ({ lat, lng }));

            const svgPreview = generateRoutePreviewSvg(coordsForPreview);
            const body = {
                name,
                geoJson,
                distanceM,
                elevationProfile,
                durationS,
                svgPreview,
                elevationGain
            }
            console.log("Sending " + JSON.stringify(body));
            const response = await axios.post("/route/addRoute", 
                body,
                { headers: { "Content-Type" : "application/json"} },
            );
            
        } catch (error) {
            console.error(error);
        }
    }


    return (routeGeoJson && (
            <div className="flex flex-col gap-2 w-full">
                <RouteNameComponent onConfirm={sendRoute} setRouteName={setRouteName} />
            </div>
        )
    )
}

interface RouteNameInputProps {
    routeName: string;
    setRouteName: React.Dispatch<React.SetStateAction<string>>;
    onConfirm: () => void;
}

const RouteNameInputComponent: React.FC<RouteNameInputProps> = ({
  routeName,
  setRouteName,
  onConfirm,
}) => {
  return (
    <>
      <Input
        type="text"
        value={routeName}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRouteName(e.target.value)}
        placeholder="Enter route name"
        dataTitle="Save route"
        onConfirm={onConfirm}
      />
    </>
  );
};



const RouteBuilderComponent: React.FC<RouteBuilderProps> = ({routeGeoJson, setRouteGeoJson, selectedLocation}) => {
    // refs for map container, map instance, markers, polyline
    const mapContainer = useRef<HTMLDivElement>(null);
    const mapRef = useRef<MtMap | null>(null);
    const markersRef = useRef<Map<number, Marker>>(new Map());
    const polylineRef = useRef<unknown | null>(null);
    const [position, setPosition] = useState< [number, number] | null >(null);

    // state for stops and routeGeoJson
    const [stops, setStops] = useState<Stop[]>([]);
    

    function removeMarker(id: number) {
        markersRef.current.get(id)?.remove();
        setStops((prev) => prev.filter((stop) => stop.id !== id));
        markersRef.current.delete(id);
        console.log("Removed marker with id " + id);
    }   
    
    useEffect(() => {
        console.log("Trying to get location")
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const coords : [ number, number ] = [
                    pos.coords.longitude,
                    pos.coords.latitude
                ];
                console.log(coords);
                setPosition(coords); 
            },
            (err) => {
                // TODO: do a Toast here
                console.log("Could not get location", err);
            }, 
            
        );
    }, []);

    useEffect(() => {
        if (!mapRef.current || !position) return;
        const map = mapRef.current;
        map.setCenter(position);
    }, [position]);

    // effect which runs once to initialize map, set up click handler to add marker
    useEffect(() => {
        if (mapContainer.current && !mapRef.current) {
            console.log("Initializing map");
            console.log("Position is " + position);
            mapRef.current = new MtMap({
                container: mapContainer.current,
                style: MapStyle.OUTDOOR,
                center: position ?? [11, 50], // 12.325727835509175, 51.3200760306479
                zoom: 18,
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


    // effect which runs when a new location search result is selected
    useEffect(() => {
        if (selectedLocation && mapRef.current) {
            const id = Date.now();
            const lng = selectedLocation[0];
            const lat = selectedLocation[1];
            setStops((prev) => [...prev, { id, coordinates: [lng, lat]}]);
            console.log("Selected location " + lng + ", " + lat);
            const marker: Marker = new Marker()
                .setLngLat([lng, lat])
                .addTo(mapRef.current);

            marker.getElement().addEventListener("click", (e) => {
                e.stopPropagation(); // prevents map click
                console.log("This marker was clicked!", marker);
                removeMarker(id);
            });

            mapRef.current.easeTo({
                center: [lng, lat],
            })
        }
    }, [selectedLocation]);


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
                    const body = {
                        "coordinates": coordinates,
                        "elevation": true
                    }
                    console.log(body);
                    console.log(JSON.stringify(body));
                    const response = await axios.post("/route/calcRouteGeoJson", 
                        body,
                        { headers: { "Content-Type" : "application/json"} }                  
                    );

                    if (response.status !== 200) {
                        throw new Error("An error occurred: " + response.status);
                    }

                    const routeGeoJson = response.data;
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
    return <div id="map-container" className="h-full w-full" ref={mapContainer} />;

};

export default RouteParentComponent;

function computeElevationTotal(elevations : number[]) {
    const threshold = 2;
    const totalElevationGain = elevations.reduce((acc, curr, index, arr) => {
        if (index === 0) {
            return 0;
        } else {
            const diff = curr - arr[index-1];
            return diff > threshold ? acc + diff : acc;
        }
    }, 0);
    return Math.round(totalElevationGain);
}

function computeElevationInfo(elevations : number[]) : ElevationInfo {
    console.log(elevations);
    const elevationInfo = {
        up: 0,
        down: 0
    }
    elevations.forEach((elevation, index, array) => {
        
        console.log()
        if (index === 0) {
            return
        }
        console.log("Elevation: " + elevation + "- " + array[index-1] + " = " + (elevation - array[index-1]));
        const delta = elevation - array[index-1];
        if (delta > 0) {
            elevationInfo.up += Math.round(delta * 100) / 100;
        } else {
            elevationInfo.down -= Math.round(delta * 100) / 100; // bec. delta will be negative
        }
        console.log(elevationInfo.up + " " + elevationInfo.down);
    })
    elevationInfo.up = Math.round(elevationInfo.up * 100) / 100;
    elevationInfo.down = Math.round(elevationInfo.down * 100) / 100;
    return elevationInfo
}