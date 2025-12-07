import { StatisticsComponent } from "@/components/own/StatisticsComponent";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useCountdown } from "@/hooks/use-countdown";
import haversine from "@/utils/haversine";
import { useEffect, useState } from "react";
import { RouteControls } from "./routeControls";

interface TrackingComponentProps {
    position : [number, number],
    speed: number,
    distanceLeft? : number
}

export function TrackingComponent({position, speed, distanceLeft} : TrackingComponentProps) {
    const [positionList, setPositionList] = useState<[number, number][]>([]);
    const [currentDistance, setCurrentDistance] = useState<number> (0);
    const [speedList, setSpeedList] = useState<number[]>([]);
    const [avgSpeed, setAvgSpeed] = useState<number> (0);
    

    useEffect(() => {
        if (positionList.length < 2) return;
        setCurrentDistance(currentDistance + haversine(positionList[-1], positionList[-2]));
    }, [positionList])

    

    useEffect(() => {
        setPositionList([...positionList, position]);
    }, [position])

    useEffect(() => {
        setSpeedList([...speedList, speed]);
        setAvgSpeed(speedList.reduce((prev, curr) => {
            return prev + curr
        }, 0));
    }, [speed])

    const [count, { startCountdown, stopCountdown, resetCountdown }] =
    useCountdown({
      countStart: 0,
      intervalMs: 1000,
      isIncrement: true,
      countStop: Infinity,
    });



    return (
        <>
            <Card>
                <CardHeader>
                    <Button onClick={startCountdown}>Start</Button>
                    <Button onClick={stopCountdown}>Stop</Button>
                </CardHeader>
                <CardContent>
                    <StatisticsComponent 
                        currSpeed={speed}
                        avgSpeed={avgSpeed}
                        distance={currentDistance}
                        duration={count}
                        distanceLeft={distanceLeft}
                    />
                    <RouteControls 
                        onPause={stopCountdown} 
                        onStart={startCountdown} 
                        onFinish={resetCountdown}
                    />
                </CardContent>
            </Card>
        </>
    )
}