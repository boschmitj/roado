import ElevationInfo from "@/app/types/ElevationInfo";

export function computeElevationTotal(elevations : number[]) {
    const threshold = 2;
    const totalElevationGain = elevations.reduce((acc, curr, index, arr) => {
        if (index === 0) {
            return 0;
        } else {
            const diff = curr - arr[index-1];
            return diff > threshold ? acc + diff : acc;
        }
    }, 0);
    return Math.round(totalElevationGain);
}

export function computeElevationInfo(elevations : number[]) : ElevationInfo {
    console.log(elevations);
    const elevationInfo = {
        up: 0,
        down: 0
    }
    elevations.forEach((elevation, index, array) => {
        
        console.log()
        if (index === 0) {
            return
        }
        console.log("Elevation: " + elevation + "- " + array[index-1] + " = " + (elevation - array[index-1]));
        const delta = elevation - array[index-1];
        if (delta > 0) {
            elevationInfo.up += Math.round(delta * 100) / 100;
        } else {
            elevationInfo.down -= Math.round(delta * 100) / 100; // bec. delta will be negative
        }
        console.log(elevationInfo.up + " " + elevationInfo.down);
    })
    elevationInfo.up = Math.round(elevationInfo.up * 100) / 100;
    elevationInfo.down = Math.round(elevationInfo.down * 100) / 100;
    return elevationInfo
}

