import PositionDTO from "./PositionDTO";

export default interface TimedStatsDTO {
    time: number;
    position: PositionDTO;
    speed: number | null;
}