import StatsDTO from "./StatsDTO";
import TimedStatsDTO from "./TimedStatsDTO";

export default interface ActivityDTO {
    name: string,
    timedStats: TimedStatsDTO[],
    stats: StatsDTO,
}