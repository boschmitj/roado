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
    const response = await axios.post(`/activity/${id}/title`,
        { title }
    );

    if (!(response.status === 200)) {
        throw new Error("Request failed");
    }

    return response.data;
}

export async function updateActivityDescription(id: number, description: string) {
    const response = await axios.post(`/activity/${id}/description`,
        { description }
    );

    if (!(response.status === 200)) {
        throw new Error("Request failed");
    }

    return response.data;
}

