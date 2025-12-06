import { StatisticsComponent } from "@/components/own/StatisticsComponent";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useCountdown } from "@/hooks/use-countdown";
import haversine from "@/utils/haversine";
import { useEffect, useState } from "react";

interface TrackingComponentProps {
    positionList: [number, number][],
    speed: number,
}

export function TrackingComponent({positionList, speed} : TrackingComponentProps) {
    const [currentDistance, setCurrentDistance] = useState<number> (0);
    const [elapsedTime, setElapsedTime] = useState<number> (0);

    useEffect(() => {
        if (positionList.length < 2) return;
        setCurrentDistance(currentDistance + haversine(positionList[-1], positionList[-2]));
    }, [positionList])

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
                    <Button>Start</Button>
                    <Button>Stop</Button>
                </CardHeader>
                <CardContent>
                    {/* TODO: Show Speed, avg. Spped, Duration, Distance here */}
                    {/* Statistics Component goes here */}
                </CardContent>
            </Card>
        </>
    )
}