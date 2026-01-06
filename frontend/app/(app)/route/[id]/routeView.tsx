import axios from "@/app/api/axios";
import { useMap } from "@/hooks/useMap";
import { useEffect, useState } from "react";
import { Route } from "@/app/(app)/routes/routeComponent";
import RouteStatContainer from "./RouteStatContainer";
import StatComponent from "../../activity/[id]/StatComponent";
import { computeDistanceNumber, computeDistanceString, computeDistanceUnit, computeDurationString, formatDuration } from "@/utils/formatter";
import RouteStatisticComponent from "../../build-route/RouteStatisticComponent";
import { Mountain, MoveDownRight, MoveUpRight, RulerDimensionLine, Timer } from "lucide-react";
import { computeElevationInfo } from "@/utils/elevationUtils";
import { extractElevationProfile } from "@/utils/geoJsonTools";
import { RouteGeoJson } from "../../build-route/RouteBuilderComponent";
import ElevationChart from "./elevationChartComponent";

export interface RouteWithCenter extends Omit<Route, 'geoJson' | 'startPoint' | 'trackImageUrl'> {
    geoJson: RouteGeoJson;
    center: [number, number];
    elevationForDistances: {distance: number, elevation: number}[]
}

export default function RouteView({params} : PageProps<'/route/[id]'>) {
    const [route, setRoute] = useState<null | RouteWithCenter>(null);
    const [distanceString, setDistanceString] = useState<string>("");
    const [durationString, setDurationString] = useState<string>("");
    const [elevationProfile, setElevationProfile] = useState<number[]>([]);
    const [up, setUp] = useState<number>(0);
    const [down, setDown] = useState<number>(0);
    const getRoute = async () => {
        const { id } = await params;
        const numId = Number(id);
        const response = await axios.get(`/route/${id}`);
        setRoute(response.data);
    };

    useEffect(() => {
        getRoute();
    }, []);

    
    const { mapContainer } = useMap({
        routeGeometries: route ?[{id: route.id, geoJson: route.geoJson.toString()}] : [],
        center: route ? route.center : [11, 50],
        zoom: 8,
    });

    useEffect(() => {
        if (route) {
            setElevationProfile(extractElevationProfile(route.geoJson));
            const elevationInfo = computeElevationInfo(elevationProfile);
            setDistanceString(computeDistanceString(route.distanceM));
            setDurationString(computeDurationString(route.durationS));
            setUp(elevationInfo.up);
            setDown(elevationInfo.down);
        }
    }, [route])


    return (
        <>
            {!route ? <div className="flex items-center justify-center h-full">Loading...</div> : 
                <>
                    <div className="" ref={mapContainer} />
                    <RouteStatContainer>
                        <RouteStatisticComponent value={distanceString} statisticName={"Distance"} icon={<RulerDimensionLine className="p-0.5"/>} />
                        <RouteStatisticComponent value={durationString} statisticName="Duration" icon={<Timer className="p-0.5"/>} />
                        <RouteStatisticComponent value={up + "m"} statisticName="Elevation Gain" icon={<Mountain className="p-0.5" />} furtherInfo={<><span className="flex items-center gap-1"><MoveUpRight className="size-4"/>{up}</span> <span className="flex items-center gap-1"><MoveDownRight className="size-4"/>{down}</span></>} />
                    </RouteStatContainer>
                    <ElevationChart elevationForDistanceArray={route.elevationForDistances} />
                    { /* road surface info here */}
                </>
            }
        </>
    )
}