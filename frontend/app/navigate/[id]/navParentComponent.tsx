import { useEffect, useRef, useState } from "react";
import RouteNavigation from "./routeNavigationMapComponent";
import { Instruction, InstructionComponent, Step } from "./turnByTurnNavComponent";
import { RouteGeoJson } from "@/app/components/RouteBuilderComponent";
import { LineString, Position } from "geojson"
import haversine from "@/utils/haversine";
import { TrackingComponent } from "./trackingComponent";

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
    const [distanceLeft, setDistanceLeft] = useState<number> (Infinity);
    const [showInstruction, setShowInstruction] = useState<boolean> (true);
    const [postitionList, setPositionList] = useState<[number, number][]> ([]);
    const [isPaused, setIsPaused] = useState<boolean>(true);
    const [distanceLeftTotal, setDistanceLeftTotal] = useState<number> (Infinity);
    const [currDistance, setCurrDistance] = useState<number> (0);
    const totalDistance = useRef<number>(0);

    function advanceStep() {
        setCurrentStepIndex(i => i + 1);
    }

    useEffect(() => {
        if (!routeGeoJson) return;
        setSteps(extractSteps(routeGeoJson));
        setCoords(extractCoords(routeGeoJson))
        setDistanceLeftTotal(getTotalDistance(routeGeoJson) - currDistance);
    }, [routeGeoJson])

    function getTotalDistance(routeGeoJson: RouteGeoJson) {
        const summary = routeGeoJson?.features[0].properties.summary;
        const distance = summary.distance ?? 0;
        totalDistance.current = distance;
        return distance;
    }

    useEffect(() => {
        setDistanceLeft(totalDistance.current - currDistance)
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
        setDistanceLeft(distance);
        if (distance < threshold) {
            console.log("advancing");
            advanceStep();
        }
    }, [position])

    useEffect(() => {
        if (position) {
            setPositionList([...postitionList, position])
        }
        console.log("Position is: " + position + ", speed: " + speed);
    }, [position])

    return (
        <>
            {showInstruction && (distanceLeft < 70) && steps && currentStepIndex < steps.length &&
                <InstructionComponent
                    {...steps[currentStepIndex]}
                    distanceLeft={distanceLeft}
                    nextDistance={steps[currentStepIndex + 1]?.distance ?? 0}
                    nextInstruction={steps[currentStepIndex + 1]?.instruction ?? ""}
                    nextType={steps[currentStepIndex + 1]?.type ?? 0}
                    onClose={() => setShowInstruction(false)}
                />
            }
            <RouteNavigation
                    id={id}
                    position={position}
                    setPosition={setPosition}
                    routeGeoJson={routeGeoJson}
                    setRouteGeoJson={setRouteGeoJson}
                    speed={speed}
                    setSpeed={setSpeed}
                    isPaused={isPaused}
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
            /> }
        </>
    );
}

function getTotalDistance(routeGeoJson: RouteGeoJson) {
    
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
