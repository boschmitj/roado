import { computeDistanceNumber, computeDistanceString, computeDistanceUnit, formatDuration } from "@/utils/formatter"
import { ReactNode } from "react"

export interface StatisticsComponentProps {
    currSpeed: number,
    avgSpeed: number,
    duration: number,
    distance: number,
    distanceLeft?: number,
}
export function StatisticsComponent ({currSpeed, avgSpeed, duration, distance, distanceLeft} : StatisticsComponentProps) {
    return (
        <div className="grid grid-cols-2 gap-4">
            <StatisticComponent>
                <BigSmallTextComponent textLarge={currSpeed} textSmall="km/h"/>
            </StatisticComponent>
            <StatisticComponent>
                <BigSmallTextComponent textLarge={computeDistanceNumber(distance)} textSmall={computeDistanceUnit(distance)}/>
            </StatisticComponent>
            <StatisticComponent>
                <BigSmallTextComponent textLarge={Math.round(avgSpeed * 10) / 10} textSmall={"⌀" + "km/h"}/>
            </StatisticComponent>
            <StatisticComponent>
                <span className="text-4xl font-bold">
                    {formatDuration(duration)}  
                </span>
            </StatisticComponent>
            { 
                distanceLeft && 
                <StatisticComponent>
                    <BigSmallTextComponent textLarge={computeDistanceNumber(distanceLeft)} textSmall={computeDistanceUnit(distanceLeft)} />
                </StatisticComponent>
            }
        </div>
    )
}

export function StatisticComponent({ children }: { children: ReactNode }) {
    return (
        <div className="flex items-center justify-start text-xl min-h-12">
            {children}
        </div>
    )
}

export function BigSmallTextComponent({ textLarge, textSmall }: { textLarge: string | number, textSmall: string | number }) {
    return (
        <>
            <span className="text-4xl font-bold">{textLarge}</span>
            <span className="text-xs ml-1">{textSmall}</span>
        </>
    )
}