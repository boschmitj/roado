"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/app/api/axios";
import ActivityParentComponent from "./ActivityParentComponent";

interface ActivityPageProps {
  params: Promise<{ id: string }>;
}

export default function ActivityPage({ params }: ActivityPageProps) {
    const [activity, setActivity] = useState(null);
    const [activityId, setActivityId] = useState<number | null>(null);
    const router = useRouter();

    useEffect(() => {
        async function fetchActivity() {
            const { id } = await params;
            const numId = Number(id);
            setActivityId(numId);

            const response = await axios.get(`/activity/${id}`);
            setActivity(response.data);
        }
        
        fetchActivity();
    }, [params, router]);

    if (!activity || activityId === null) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    return <ActivityParentComponent activity={activity} activityId={activityId} />;
}
