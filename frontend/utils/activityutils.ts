import ActivityDTO from "@/app/types/ActivityDTO";
import axios from "../app/api/axios";
import { durationInHours } from "./formatter";

export async function fetchActivityById(id: number) {
    const response = await axios.get(`/activity/${id}`);
    if (!(response.status === 200)) {
        throw new Error("Request failed");
    }

    return response.data satisfies ActivityDTO;

}

export async function updateActivityTitle(id: number, title: string) {
    const response = await axios.put(`/activity/title`,
        { "activityId": id, "title": title }
    );

    if (!(response.status === 200)) {
        throw new Error("Request failed");
    }

    return response.data;
}

export async function updateActivityDescription(id: number, description: string) {
    console.log("Sending request");

    const response = await axios.put(`/activity/description`,
        { "activityId": id, "description": description }
    );


    if (!(response.status === 200)) {
        throw new Error("Request failed");
    }

    return response.data;
}

export function approximateKcal(avgSpeedKmH: number, duration: number, elevationGain: number) : number {
    const avgSpeedMps = avgSpeedKmH / 3.6;
    const kcal = ((9.8 * 85 * elevationGain) + (0.3 * Math.pow(avgSpeedMps, 3) * duration)) / 4184;
    return Math.round(kcal * 10) / 10;
}

export function approximateNeededHydration(duration: number) : number {
    const hydration = 0.75**2 * durationInHours(duration) ;
    return hydration;
}

