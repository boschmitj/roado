import { StatisticsComponent } from "@/components/own/StatisticsComponent";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCountdown } from "@/hooks/use-countdown";
import haversine from "@/utils/haversine";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { RouteControls } from "./routeControls";
import { getHours } from "@/utils/formatter";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TrackingComponentProps {
    position : [number, number],
    speed: number,
    distanceLeft? : number,
    isPaused: boolean,
    setIsPaused: (input: boolean) => void,
    currDistance: number,
    setCurrDistance: (input: number) => void,
    setIsFinishDialogOpen: (input: boolean) => void;
    isFinishDialogOpen: boolean;
    stopwatch: number;
    backgroundStopwatch: number,
    startCount: () => void;
    stopCount: () => void;
    startBackgroundCount: () => void;
    stopBackgroundCount: () => void;
    speedList: number[];
    setSpeedList: Dispatch<SetStateAction<number[]>>;
    avgSpeed: number,
    setAvgSpeed: Dispatch<SetStateAction<number>>;
    setStartDateTime: Dispatch<SetStateAction<Date>>;
}

export function TrackingComponent({position, 
                                    speed, 
                                    distanceLeft, 
                                    isPaused, 
                                    setIsPaused, 
                                    currDistance, 
                                    setCurrDistance, 
                                    setIsFinishDialogOpen, 
                                    isFinishDialogOpen,
                                    stopwatch,
                                    backgroundStopwatch,
                                    startBackgroundCount,
                                    stopBackgroundCount,
                                    startCount,
                                    stopCount,
                                    speedList,
                                    setSpeedList,
                                    avgSpeed,
                                    setAvgSpeed,
                                    setStartDateTime
} : TrackingComponentProps) {
    const [positionList, setPositionList] = useState<[number, number][]>([]);
    
    
    const [backgroundDistance, setBackgroundDistance] = useState<number> (0);
    const [statisticsShown, setStatisticsShown] = useState<boolean> (true);
    
    const startRoute = () => {
        setStartDateTime(new Date());
        startCount();
    }

    useEffect(() => {
        if (positionList.length < 2) return;
        if (!isPaused) {
            setCurrDistance(currDistance + haversine(positionList.at(-1)!, positionList.at(-2)!));
        } else {
            setBackgroundDistance(backgroundDistance + haversine(positionList.at(-1)!, positionList.at(-2)!))
        }
    }, [positionList])

    useEffect(() => {
        if (!isPaused) {
            stopBackgroundCount();
            setCurrDistance(currDistance + backgroundDistance);
            setBackgroundDistance(0);
        } else {
            startBackgroundCount();
        }
    }, [isPaused])

    useEffect(() => {
        setPositionList([...positionList, position]);
        // console.log("Background Distance is: " + backgroundDistance);
    }, [position])

    useEffect(() => {
        const updated = [...speedList, speed];
        console.log(updated)
        if (!isPaused) setSpeedList(updated);

        let averageSpeed;
        if (updated.filter((s) => s !== 0).length === 0 && stopwatch) {
            const hours = getHours(stopwatch + backgroundStopwatch);
            averageSpeed = Math.round(((currDistance / 1000) / hours) * 10) / 10;
            setAvgSpeed(averageSpeed)
            return;
        } else {
            averageSpeed = computeAverageSpeedOngoing(
                updated.length,
                avgSpeed,
                speed
            )
        }
        
        if (!stopwatch) {
            setAvgSpeed(averageSpeed)
        } else {
            setAvgSpeed(isNaN(averageSpeed) ? 0 : averageSpeed)
        }
    }, [speed, currDistance])

    function onFinish() {
        // user gets prompted if he wants to end the route
        setIsFinishDialogOpen(true);
    }

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
                            {statisticsShown && !isFinishDialogOpen && (
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
                                        duration={stopwatch}
                                        distanceLeft={distanceLeft}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                        
                        <RouteControls 
                            onPause={stopCount} 
                            onStart={startRoute} 
                            onFinish={onFinish}
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