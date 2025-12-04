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