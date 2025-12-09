import { StatisticsComponent } from "@/components/own/StatisticsComponent";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCountdown } from "@/hooks/use-countdown";
import haversine from "@/utils/haversine";
import { useEffect, useState } from "react";
import { RouteControls } from "./routeControls";
import { getHours } from "@/utils/formatter";
import { get } from "http";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence, distance } from "framer-motion";
import { getgid } from "process";

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
    const [backgroundDistance, setBackgroundDistance] = useState<number> (0);
    const [statisticsShown, setStatisticsShown] = useState<boolean> (true);

    useEffect(() => {
        if (positionList.length < 2) return;
        if (!isPaused) {
            setCurrDistance(currDistance + haversine(positionList.at(-1)!, positionList.at(-2)!));
        } else {
            setBackgroundDistance(backgroundDistance + haversine(positionList.at(-1)!, positionList.at(-2)!))
        }
    }, [positionList])

    useEffect(() => {
        if (isPaused) {
            setCurrDistance(currDistance + backgroundDistance);
            setBackgroundDistance(0);
        }
    }, [isPaused])

    useEffect(() => {
        setPositionList([...positionList, position]);
    }, [position])

    useEffect(() => {
        const updated = [...speedList, speed];
        console.log(updated)
        if (!isPaused) setSpeedList(updated);

        let averageSpeed;
        if (!avgSpeed && !speed && count) {
            
            const hours = getHours(count);
            averageSpeed = Math.round(((currDistance / 1000) / hours) * 10) / 10;
            console.log(hours);
            console.log("Im here 1: avgSpeed: " + averageSpeed);   
        } else {
            averageSpeed = computeAverageSpeedOngoing(
                updated.length,
                avgSpeed,
                speed
            )
        }
        
        if (!count) {
            setAvgSpeed(averageSpeed)
        } else {
            setAvgSpeed(isNaN(averageSpeed) ? 0 : averageSpeed)
        }
    }, [speed, currDistance])

    const [count, { startCountdown, stopCountdown, resetCountdown }] =
    useCountdown({
      countStart: 0,
      intervalMs: 1000,
      isIncrement: true,
      countStop: Infinity,
    });



    return (
        <>
            <div className="absolute z-10 bottom-2 left-1/2 -translate-x-1/2 w-sm">
                <Button variant="ghost" size="icon" onClick={() => setStatisticsShown(!statisticsShown)} className="absolute z-11 top-2 right-2">
                    {statisticsShown && <ChevronDown />}
                    {!statisticsShown && <ChevronUp />}
                    {/* Maybe animate this too.. -> only one Chevron which is flipped*/}
                </Button>
                <Card className="min-w-2xs max-w-2xl w-sm relative">
                    <CardContent>
                        <AnimatePresence initial={false}>
                            {statisticsShown && (
                                <motion.div 
                                    key="stats"
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.25, ease: "easeInOut" }}
                                    className="overflow-hidden"
                                >
                                    <StatisticsComponent 
                                        currSpeed={speed}
                                        avgSpeed={avgSpeed}
                                        distance={currDistance}
                                        duration={count}
                                        distanceLeft={distanceLeft}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                        
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

function computeAverageSpeedOngoing(n: number, avgSpeed: number, currSpeed: number) {
    return avgSpeed + (currSpeed - avgSpeed) / n;
}