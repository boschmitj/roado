export function computeDurationString(duration: number) {
    let durationString;
    if (duration > 3600) {
        durationString = Math.floor(duration / 3600) + "h" + Math.round(duration) % 60 + "min";
    } else if (duration > 60) {
        durationString = Math.round(duration / 60) + "min";
    } else if (duration > 0) {
        durationString = duration + "s";
    } else return null;
    return durationString;
}

export function computeDistanceString(distance : number) {
    let distanceString;
    if (distance > 1000) {
        distanceString = (distance / 1000).toFixed(1) + "km"
    } else if (distance > 0) {
        distanceString = Math.round(distance) + "m"
    } else return null;
    return distanceString;
}

export function computeDistanceNumber(distance: number) {
    let distanceNumber;
    if (distance > 1000) {
        distanceNumber = (distance / 1000).toFixed(1)
    } else if (distance > 0) {
        distanceNumber = Math.round(distance)
    } else return 0;
    return distanceNumber;
}

export function computeDistanceUnit(distance: number) {
    let unit;
    if (distance > 1000) {
        unit = "km"
    } else if (distance > 0) {
        unit = "m"
    } else return "m";
    return unit;
}

export function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const hh = String(hrs).padStart(2, "0");
  const mm = String(mins).padStart(2, "0");
  const ss = String(secs).padStart(2, "0");

  return `${hh}:${mm}:${ss}`;
}


export function formatInstruction(instruction : string, type : number) {
    const threeWordInstructionTypes = [2,3,4,5,11] //mby 7, 8, and 12, 13 too
    if (threeWordInstructionTypes.includes(type)) {
        return instruction.split(" ").splice(0, 2).join(" ");
    } 
    return instruction.split(" ").splice(0,3).join(" ");
                    
}