"use client";

import axios from "@/app/api/axios";
import { RouteCard, route } from "./routeComponent";
import { Stack } from "@/components/own/Stack";
import { use, useEffect, useState, useMemo } from "react";
import SelectSorting from "./SelectSorting";
import { usePosition } from "@/hooks/use-position";
import haversine from "@/utils/haversine";
import { useMap } from "@/hooks/useMap";
import SelectProximity from "./SelectProximity";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";


export function RouteOverview() {
    const [routes, setRoutes] = useState<route[]>([]);
    const [selectedSorting, setSelectedSorting] = useState<string>("proximity");
    const [selectedProximity, setSelectedProximity] = useState<number>(5000);
    const [hoveredRouteId, setHoveredRouteId] = useState<number | null>(null);
    const [center, setCenter] = useState<[number, number] | null>(null);

    const {position, error, loading} = usePosition();

    useEffect(() => {
        switch (selectedSorting) {
            case "proximity":
                if (position === null) {
                    return;
                }
                setRoutes([...routes].sort((a, b) => haversine([position.longitude, position.latitude], a.startPoint) - haversine([position.longitude, position.latitude], b.startPoint)));
                break;
            case "duration":
                setRoutes([...routes].sort((a, b) => a.durationS - b.durationS));
                break;
            case "length":
                setRoutes([...routes].sort((a, b) => a.distanceM - b.distanceM));
                break;
            case "name":
                setRoutes([...routes].sort((a, b) => a.name.localeCompare(b.name)));
                break;
        }
    }, [selectedSorting]);

    const getRoutes = async (longitude?: number, latitude?: number) => {
        try {
            const response = await axios.get("/route/all" + (longitude && latitude ? `?x=${longitude}&y=${latitude}&radius=${selectedProximity}` : ""));
            if (response.status !== 200) {
                throw new Error("An Error occured: " + response.status);
            }  
            setRoutes(response.data)
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        if (!position) {
            getRoutes();
        } else {
            getRoutes(position.longitude, position.latitude);
        }
    }, [loading, selectedProximity]);

    const routeGeometries = useMemo(() => 
        routes.map((r) => ({id: r.id, geoJson: r.geoJson})),
        [routes]
    );

    const { mapContainer, highlightRoute } = useMap({
        center: position ? [position.longitude, position.latitude] : [11, 50],
        zoom: 12,
        routeGeometries: routeGeometries,
        onCenterChange: setCenter
    });

    useEffect(() => {
        highlightRoute(hoveredRouteId);
    }, [hoveredRouteId]);


    return (
        <div className="flex flex-col lg:flex-row w-full h-[calc(100vh-88px)] overflow-hidden">
            {/* Sorting components - Mobile: order-1 (top), Desktop: inside sidebar */}
            <div className="lg:hidden flex justify-end gap-2 p-4 border-b border-border flex-shrink-0 order-1">
                <SelectSorting setSelectedSorting={setSelectedSorting}/>
                <SelectProximity setSelectedProximity={setSelectedProximity}/>
            </div>

            {/* Map - Mobile: order-2 (middle), Desktop: order-1 (left, 70%) */}
            <div className="w-full lg:w-[70%] flex-1 lg:h-full flex-shrink-0 order-2 lg:order-1 min-h-0">
                <div ref={mapContainer} className="w-full h-full" />
            </div>

            {/* Right sidebar - Desktop only: order-2, contains sorting + routes */}
            <div className="hidden lg:flex lg:w-[30%] flex-col flex-shrink-0 lg:order-2 lg:border-l border-border lg:h-full">
                {/* Desktop: Sorting components at top */}
                <div className="flex gap-2 p-4 border-b border-border flex-shrink-0">
                    <SelectSorting setSelectedSorting={setSelectedSorting}/>
                    <SelectProximity setSelectedProximity={setSelectedProximity}/>
                </div>
                
                {/* Desktop: Routes Stack - scrollable */}
                <div className="overflow-y-auto p-4 flex-1">
                    <div className="flex flex-col gap-4 w-full">
                        {routes.map((r) => (
                            <div
                                key={r.id}
                                onMouseEnter={() => setHoveredRouteId(r.id)}
                                onMouseLeave={() => setHoveredRouteId(null)}
                                className="w-full"
                            >
                                <RouteCard {...r} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mobile: Routes Stack - order-3 (bottom), horizontal scroll */}
            <div className="lg:hidden overflow-x-auto p-4 order-3 flex-shrink-0">
                <div className="flex flex-row gap-4 w-max">
                    {routes.map((r) => (
                        <div
                            key={r.id}
                            onClick={() => setHoveredRouteId(hoveredRouteId === r.id ? null : r.id)}
                            className={cn(
                                "w-[80vw] flex-shrink-0 cursor-pointer transition-transform",
                                hoveredRouteId === r.id && "scale-[1.02]"
                            )}
                        >
                            <RouteCard {...r} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}