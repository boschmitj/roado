import { StatisticsComponent } from "@/components/own/StatisticsComponent";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCountdown } from "@/hooks/use-countdown";
import haversine from "@/utils/haversine";
import { useEffect, useState } from "react";
import { RouteControls } from "./routeControls";

interface TrackingComponentProps {
    position : [number, number],
    speed: number,
    distanceLeft? : number,
    isPaused: boolean,
    setIsPaused: (input: boolean) => void,
    currDistance: number,
    setCurrDistance: (input: number) => void,
}

export function TrackingComponent({position, speed, distanceLeft, isPaused, setIsPaused, currDistance, setCurrDistance} : TrackingComponentProps) {
    const [positionList, setPositionList] = useState<[number, number][]>([]);
    const [speedList, setSpeedList] = useState<number[]>([]);
    const [avgSpeed, setAvgSpeed] = useState<number> (0);
    

    useEffect(() => {
        if (positionList.length < 2) return;
        setCurrDistance(currDistance + haversine(positionList.at(-1)!, positionList.at(-2)!));
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
            <div className="absolute z-10 top-2 left-1/2 -translate-x-1/2 w-sm">
                <Card className="min-w-2xs max-w-2xl w-sm relative">
                    <CardHeader>
                        <CardTitle>
                            <p className="font-bold text-xl">
                                Statistics
                            </p>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <StatisticsComponent 
                            currSpeed={speed}
                            avgSpeed={avgSpeed}
                            distance={currDistance}
                            duration={count}
                            distanceLeft={distanceLeft}
                        />
                        <RouteControls 
                            onPause={stopCountdown} 
                            onStart={startCountdown} 
                            onFinish={resetCountdown}
                            isPaused={isPaused}
                            setIsPaused={setIsPaused}
                        />
                    </CardContent>
                </Card>
            </div>
        </>
    )
}