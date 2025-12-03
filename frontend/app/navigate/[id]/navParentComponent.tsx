import { useEffect, useState } from "react";
import RouteNavigation from "./routeNavigationMapComponent";
import { Instruction } from "./turnByTurnNavComponent";

interface NavParentComponentProps {
    id: number;
}

export default function NavParentComponent ({id} : NavParentComponentProps) {
    const [position, setPosition] = useState< [number, number] | null >(null);
    const [routeGeoJson, setRouteGeoJson] = useState <string> ("");
    const [speed, setSpeed] = useState <number | null>(null);
    const [nextInstruction, setNextInstruction] = useState <Instruction | null> (null);

    useEffect(() => {
        setNextInstruction(calculateInstruction(routeGeoJson));
    }, [routeGeoJson])

    return (
        <RouteNavigation
                id={id}
                position={position}
                setPosition={setPosition}
                routeGeoJson={routeGeoJson}
                setRouteGeoJson={setRouteGeoJson}
                speed={speed}
                setSpeed={setSpeed}
        />
    );
}



function calculateInstruction(routeGeoJson : string) {
    //TODO: extrahiere hier steps aus JSON: features[0].properties.segments[x].steps
    // Gib routeGeoJson den richtigen Typ, um auslesen möglich zu machen
    return null;
}
