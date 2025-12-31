import { useEffect, useRef, useState } from "react";
import RouteNavigation from "./routeNavigationMapComponent";
import { Instruction, InstructionComponent, Step } from "./turnByTurnNavComponent";
import { RouteGeoJson } from "@/app/components/RouteBuilderComponent";
import { LineString, Position } from "geojson"
import haversine from "@/utils/haversine";
import { TrackingComponent } from "./trackingComponent";
import { ConfirmationDialog } from "@/components/own/ConfirmationDialog";
import axios from "@/app/api/axios";
import { useCountdown } from "@/hooks/use-countdown";
import TimedStatsDTO from "@/app/types/TimedStatsDTO";
import ActivityCreatedDTO from "@/app/types/ActivityCreatedDTO";
import { useRouter } from "next/navigation";

interface NavParentComponentProps {
    id: number;
}

export default function NavParentComponent ({id} : NavParentComponentProps) {
    const [position, setPosition] = useState< [number, number] | null >(null);
    const [routeGeoJson, setRouteGeoJson] = useState <RouteGeoJson | null> (null);
    const [speed, setSpeed] = useState <number | null>(null);
    const [steps, setSteps] = useState <Step[] | null> (null);
    const [coords, setCoords] = useState <Position[] | null> (null);
    const [currentStepIndex, setCurrentStepIndex] = useState<number> (0);
    const [distanceLeftToNextStop, setDistanceLeftToNextStop] = useState<number> (Infinity);
    const [showInstruction, setShowInstruction] = useState<boolean> (true);
    const [positionTimeRecords, setPositionTimeRecords] = useState<{"time": number, "position": [number, number], "speed": number | null}[]> ([]);
    const [isPaused, setIsPaused] = useState<boolean>(true);
    const [distanceLeftTotal, setDistanceLeftTotal] = useState<number> (Infinity);
    const [currDistance, setCurrDistance] = useState<number> (0);
    const totalDistance = useRef<number>(0);
    const [isFinishDialogOpen, setIsFinishDialogOpen] = useState<boolean> (false);
    const [speedList, setSpeedList] = useState<{"time": number, "speed": number}[]>([]);
    const [avgSpeed, setAvgSpeed] = useState<number> (0);
    const [startDateTime, setStartDateTime] = useState<Date>(new Date(0));

    const router = useRouter();

    function advanceStep() {
        setCurrentStepIndex(i => i + 1);
    }

    useEffect(() => {
        if (!routeGeoJson) return;
        setSteps(extractSteps(routeGeoJson));
        setCoords(extractCoords(routeGeoJson))
        setDistanceLeftTotal(getTotalDistance(routeGeoJson) - currDistance);
        console.log("Got the following route: " + JSON.stringify(routeGeoJson))
    }, [routeGeoJson])

    function getTotalDistance(routeGeoJson: RouteGeoJson) {
        if (totalDistance.current) return totalDistance.current;
        const summary = routeGeoJson?.features[0].properties.summary;
        const distance = summary.distance ?? 0;
        totalDistance.current = distance;
        return distance;
    }

    useEffect(() => {
        // setDistanceLeftToNextStop(totalDistance.current - currDistance);
        setDistanceLeftTotal(totalDistance.current - currDistance);
    }, [currDistance])

    useEffect(() => {
        setShowInstruction(true);
    }, [currentStepIndex])

    useEffect(() => {
        if (!steps || !coords || !position) return;
        const currentStep = steps[currentStepIndex];
        const start = currentStep.way_points[0];
        const end = currentStep.way_points[1];
        const stepCoords = coords.slice(start, end + 1);
        const [lng, lat] = stepCoords.at(-1)!
        const distance = haversine(position, [lng, lat]);

        const threshold = 7
        setDistanceLeftToNextStop(distance);
        if (distance < threshold) {
            console.log("advancing");
            advanceStep();
        }
    }, [position])

    useEffect(() => {
        if (position) {
            setPositionTimeRecords([...positionTimeRecords, {"time": Date.now() - startDateTime.getTime(), "position": position , "speed": speed}])
        }
        
        console.log("Position is: " + position + ", speed: " + speed);
    }, [position])

    async function finishRoute(): Promise<void> {
        try {
            const response = await axios.post(`/activity/${id}/finish`, {
                "plannedRouteId": id,
                "timedStats": positionTimeRecords.map(r => ({
                    time: r.time,
                    position: { lon: r.position[0], lat: r.position[1] },
                    speed: r.speed
                })),
                "stats": {
                    "totalDistance": currDistance,
                    "totalDuration": stopwatch,
                    "avgSpeed": avgSpeed,
                    "startDate": startDateTime,
                    "endDate": new Date(),
                }
            });

            const activityId = response.data.activityId;
            router.push(`/activity/${activityId}`);
        } catch (error) {
            console.error("Failed to finish route:", error);
            // Optionally show error toast/dialog to user
        }
    }

    const [stopwatch, { startCountdown, stopCountdown, resetCountdown }] =
    useCountdown({
        countStart: 0,
        intervalMs: 1000,
        isIncrement: true,
        countStop: Infinity,
    });
    
    const [backgroundStopwatch, { startCountdown: startBackgroundCountdown, stopCountdown: stopBackgroundCountdown, resetCountdown: resetBackgroundCountdown }] =
    useCountdown({
        countStart: 0,
        intervalMs: 1000,
        isIncrement: true,
        countStop: Infinity,
    });

    return (
        <>
            
            {showInstruction && (distanceLeftToNextStop < 70) && steps && currentStepIndex < steps.length && !isFinishDialogOpen &&
                <InstructionComponent
                    {...steps[currentStepIndex]}
                    distanceLeft={distanceLeftToNextStop}
                    nextDistance={steps[currentStepIndex + 1]?.distance ?? 0}
                    nextInstruction={steps[currentStepIndex + 1]?.instruction ?? ""}
                    nextType={steps[currentStepIndex + 1]?.type ?? 0}
                    onClose={() => setShowInstruction(false)}
                />
            }

            <ConfirmationDialog
                open={isFinishDialogOpen}
                onOpenChange={() => setIsFinishDialogOpen(false)}
                title="Finish activity"
                description="Congrats! You completed the route. Do you want to finish and save your activity now or keep riding?"
                onConfirm={() => finishRoute()}
                confirmText="Finish activity"
                cancelText="Ride on"
            />

            <RouteNavigation
                    id={id}
                    position={position}
                    setPosition={setPosition}
                    routeGeoJson={routeGeoJson}
                    setRouteGeoJson={setRouteGeoJson}
                    onRouteCompleted={() => setIsFinishDialogOpen(true)}
                    speed={speed}
                    setSpeed={setSpeed}
                    isPaused={isPaused}
                    coords={coords}
            />
            {position && 
            <TrackingComponent 
                position={position}
                speed={speed ?? 0}
                distanceLeft={distanceLeftTotal}
                isPaused={isPaused}
                setIsPaused={setIsPaused}
                currDistance={currDistance}
                setCurrDistance={setCurrDistance}
                setIsFinishDialogOpen={setIsFinishDialogOpen}
                isFinishDialogOpen={isFinishDialogOpen}
                stopwatch={stopwatch}
                backgroundStopwatch={backgroundStopwatch}
                startCount={startCountdown}
                stopCount={stopCountdown}
                startBackgroundCount={startBackgroundCountdown}
                stopBackgroundCount={stopBackgroundCountdown}
                speedList={speedList}
                setSpeedList={setSpeedList}
                avgSpeed={avgSpeed}
                setAvgSpeed={setAvgSpeed}
                startDateTime={startDateTime}
                setStartDateTime={setStartDateTime}
            /> }
        </>
    );
}


function extractCoords(routeGeoJson : RouteGeoJson) {
    const coords : Position[] = []
    routeGeoJson.features.forEach(f => {
        const geometry = f.geometry as LineString;
        coords.push(...geometry.coordinates);
    });
    return coords;
}

function extractSteps(routeGeoJson : RouteGeoJson) {
    const steps: Step[] = [];
    routeGeoJson.features.forEach((f) => {
        f.properties.segments.forEach((s) => {
            s.steps.forEach((step) => {
                if (step.distance === 0 && step.duration === 0 && step.type === 10) return;
                steps.push(step);
            })
        })
    })
    return steps;
}
