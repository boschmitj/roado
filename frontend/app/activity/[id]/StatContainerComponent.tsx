import { Card, CardContent } from "@/components/ui/card"
import CShapeComponent from "./CShapeComponent"
import StatComponent from "./StatComponent"
import { computeDistanceNumber, computeDistanceUnit, formatDuration } from "@/utils/formatter"
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface StatContainerComponent {
    durationS: number,
    distanceM: number,
    elevationGain: number,
    avgSpeed: number,
}
// compute the estimated kcal burned

export default function StatContainerComponent({durationS, distanceM, elevationGain, avgSpeed} : StatContainerComponent) {
    
    return (
        <div className="w-full">
            <div className="flex flex-row gap-4 justify-center items-center min-h-12">
                <motion.div
                    initial={{x: 100, opacity: 0}}
                    whileInView={{ x: 0, opacity: 1}}
                    viewport={{ once: true, amount: 0.3}}
                    transition={{duration: 0.6, ease: [0.22, 1, 0.36, 1]}}
                    className="w-full"
                >
                    <CShapeComponent comingFromLeft={false}>
                        <StatComponent name="Distance" unit={computeDistanceUnit(distanceM)} value={computeDistanceNumber(distanceM)} />
                        <StatComponent name="Duration" unit="" value={formatDuration(durationS)} />
                    </CShapeComponent>
                </motion.div>
                
                <motion.div
                    initial={{x: -100, opacity: 0}}
                    whileInView={{ x: 0, opacity: 1}}
                    viewport={{ once: true, amount: 0.3}}
                    transition={{duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1}}
                    className="w-full"
                >
                    <CShapeComponent comingFromLeft={true}>
                        <StatComponent name="Elevation" unit="m" value={elevationGain} />
                        <StatComponent name="Average Speed" unit="km/h" value={avgSpeed} />
                    </CShapeComponent>
                </motion.div>
                
            </div>
        </div>
    )
}