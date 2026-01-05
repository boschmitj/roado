import TimedStatsDTO from "@/app/types/TimedStatsDTO";
import AreaChartElevationSpeed from "@/app/activity/[id]/areaChartActivityComponent";

export interface GraphComponentProps {
    timedStats: TimedStatsDTO[];
}

export default function GraphComponent ({timedStats} : GraphComponentProps) {
    return (
        <div className="w-full">
            <AreaChartElevationSpeed timedStats={timedStats} />
        </div>
    )
}