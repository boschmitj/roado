import ActivityDTO from "@/app/types/ActivityDTO";
import axios from "../app/api/axios";

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

