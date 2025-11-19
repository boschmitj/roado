"use client";


import React, { useState, useEffect, useRef } from "react";
import { Map as MtMap, MapStyle, helpers, config, Marker,} from "@maptiler/sdk";
import { FeatureCollection, Geometry, GeoJsonProperties } from "geojson";
import Button from "./Button";
import Input from "./Input";

import '@maptiler/sdk/dist/maptiler-sdk.css';
import './RouteBuilderComponent.css'
import axios from "../api/axios";

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
    const [routeGeoJson, setRouteGeoJson] = useState< RouteGeoJson | null >(null);
    

    return (
        
        <div className="route-parent__parent">
            <div className="route-parent__left">
                <RouteInfoComponent routeGeoJson={routeGeoJson} />
                <RouteConfirmComponent routeGeoJson={routeGeoJson}/>
            </div>
            <div className="route-parent__map">
                <RouteBuilderComponent routeGeoJson={routeGeoJson} setRouteGeoJson={setRouteGeoJson} /> 
            </div>
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
    const elevationGainTotal = computeElevationTotal(elevations);
    const speedKmH = (distance && duration) ? Math.round((distance / duration) * 3.6) + "km/h" : null;
    return (
        <div className="route-info">
            <div className="route-info__div">
                <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" stroke-width="3" stroke="#ffffff" fill="none"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M17.94,54.81a.1.1,0,0,1-.14,0c-1-1.11-11.69-13.23-11.69-21.26,0-9.94,6.5-12.24,11.76-12.24,4.84,0,11.06,2.6,11.06,12.24C28.93,41.84,18.87,53.72,17.94,54.81Z"></path><circle cx="17.52" cy="31.38" r="4.75"></circle><path d="M49.58,34.77a.11.11,0,0,1-.15,0c-.87-1-9.19-10.45-9.19-16.74,0-7.84,5.12-9.65,9.27-9.65,3.81,0,8.71,2,8.71,9.65C58.22,24.52,50.4,33.81,49.58,34.77Z"></path><circle cx="49.23" cy="17.32" r="3.75"></circle><path d="M17.87,54.89a28.73,28.73,0,0,0,3.9.89"></path><path d="M24.68,56.07c2.79.12,5.85-.28,7.9-2.08,5.8-5.09,2.89-11.25,6.75-14.71a16.72,16.72,0,0,1,4.93-3" stroke-dasharray="7.8 2.92"></path><path d="M45.63,35.8a23,23,0,0,1,3.88-.95"></path></g></svg>
                <p className="route-info__text" >Distance: {distanceString}</p>
            </div>
            <div className="route-info__div">
                <svg fill="#ffffff" width="189px" height="189px" viewBox="-1.5 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="m18.241 6.523 1.45-1.657-1.657-1.45-1.45 1.553c-1.361-1.014-3.014-1.714-4.811-1.961l-.055-.006v-.932h2.588v-2.071h-7.351v2.071h2.588v1.035c-5.369.49-9.543 4.97-9.543 10.426 0 5.781 4.686 10.467 10.467 10.467s10.467-4.686 10.467-10.467c0-2.7-1.022-5.162-2.701-7.018l.008.009zm-7.662 14.806c-4.403 0-7.972-3.569-7.972-7.972s3.569-7.972 7.972-7.972c2.225.018 4.234.925 5.695 2.382 1.47 1.447 2.381 3.459 2.381 5.683v.012-.001c-.173 4.347-3.711 7.812-8.07 7.869h-.006z"></path><path d="m9.544 7.248h2.174v7.972h-2.174z"></path></g></svg>
                <p className="route-info__text">Duration: {durationString}</p>
            </div>
            <div className="route-info__div">
                <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" stroke-width="3" stroke="#ffffff" fill="none"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M28.79,44l-9.4-9.4S31.76,5.41,56.77,7C56.77,7,60.25,30.12,28.79,44Z"></path><path d="M56,16.82a10.87,10.87,0,0,1-6-3.08,11,11,0,0,1-3.11-6.15"></path><circle cx="42.32" cy="21.44" r="5.48"></circle><path d="M30.61,43.16,30,47.84a.24.24,0,0,0,.33.25l8-3.47A2.32,2.32,0,0,0,39.63,43l1.22-5.83"></path><path d="M20,33.29l-4.69.6a.23.23,0,0,1-.24-.32l3.46-7.95a2.33,2.33,0,0,1,1.67-1.35l5.82-1.22"></path><path d="M21.49,36.68c-6.55,2.1-6.88,12.47-6.88,12.47s10.08.11,12.59-6.76"></path><line x1="10.88" y1="52.82" x2="7.12" y2="56.59" stroke-linecap="round"></line><line x1="10.6" y1="45.63" x2="7.41" y2="48.81" stroke-linecap="round"></line><line x1="17.94" y1="53.11" x2="14.76" y2="56.3" stroke-linecap="round"></line></g></svg>
                <p className="route-info__text">Speed: {speedKmH}</p>
            </div>
            <div className="route-info__div">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M13 14L17 9L22 18H2.84444C2.46441 18 2.2233 17.5928 2.40603 17.2596L10.0509 3.31896C10.2429 2.96885 10.7476 2.97394 10.9325 3.32786L15.122 11.3476" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                <p className="route-info__text">Elevation gain: {elevationGainTotal}m</p>
            </div>
        </div>
    )
}

const RouteConfirmComponent = ({routeGeoJson} : RouteViewerProps) => {

    const [routeName, setRouteName] = useState("");
    const [showInput, setShowInput] = useState(false);


    const summary = routeGeoJson?.features[0].properties.summary;
    console.log(routeGeoJson);
    const distanceM = summary?.distance;
    const durationS = summary?.duration;
    const createdBy = 1;
    const name = routeName;
    const geoData = JSON.stringify(routeGeoJson);
    const elevationProfile = null;
    const sendRoute = async () => {
        if (!routeName) {
            console.log("Route name is empty");
            return;
        } else if (!routeGeoJson) {
            console.log("No route to save");
            return;
        }
        try {
            const body = {
                createdBy,
                name,
                geoData,
                distanceM,
                elevationProfile,
                durationS,
            }
            console.log("Sending " + JSON.stringify(body));
            const response = await axios.post("http://localhost:8080/route/addRoute", 
                body,
                { headers: { "Content-Type" : "application/json"} },
            );
            
        } catch (error) {
            console.error(error);
        }
    }
    return (routeGeoJson && (
            <div className="createRoute-section">
                
                <RouteNameInputComponent 
                    routeName={routeName} 
                    setRouteName={setRouteName}
                    onConfirm={sendRoute}
                />
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
                    const body = {
                        "coordinates": coordinates,
                        "elevation": true
                    }
                    console.log(body);
                    console.log(JSON.stringify(body));
                    const response = await axios.post("http://localhost:8080/route/calcRouteGeoJson", 
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
    return <div id="map-container" ref={mapContainer} />;

};

export default RouteParentComponent;


function computeDurationString(duration: number) {
    let durationString;
    if (duration > 3600) {
        durationString = Math.floor(duration / 3600) + "h" + Math.round(duration) % 60 + "min";
    } else if (duration > 60) {
        durationString = Math.round(duration / 60) + "min";
    } else if (duration > 0) {
        durationString = duration + "s";
    } else return null;
    return durationString;
}

function computeDistanceString(distance : number) {
    let distanceString;
    if (distance > 1000) {
        distanceString = (distance / 1000).toFixed(1) + "km"
    } else if (distance > 0) {
        distanceString = distance + "m"
    } else return null;
    return distanceString;
}

function computeElevationTotal(elevations : number[]) {
    let threshold = 2;
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