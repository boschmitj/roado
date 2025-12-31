"use client";

import ActivityDTO from "@/app/types/ActivityDTO";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import TitleComponent from "./TitleComponent";
import { useState } from "react";
import { updateActivityDescription, updateActivityTitle } from "@/utils/activityutils";
import DescriptionComponent from "./DescriptionComponent";
import RecordedOnComponent from "./RecordedOnComponent";
import { RouteImageComponent } from "./RouteImageComponent";
import StatContainerComponent from "./StatContainerComponent";
import GraphComponent from "./GraphComponent";

interface Props {
    activityId: number;
    activity: ActivityDTO
}
export default function ActivityParentComponent({activity, activityId} : Props) {
    const [title, setTitle] = useState(activity.name);
    const [description, setDescription] = useState('');

    const handleTitleSave = (newTitle: string) => {
        setTitle(newTitle);
        updateActivityTitle(activityId, newTitle)
    };

    const handleDescriptionSave = (newDescription: string) => {
        setDescription(newDescription);
        updateActivityDescription(activityId, newDescription);
    }

    return (
        <Card className="flex flex-col w-[80%]">

            <div className="w-full">
                <RouteImageComponent activityId={activityId} />
            </div>

            <CardHeader className="w-full">
                <TitleComponent title={title} setTitle={setTitle} onSave={handleTitleSave} />
                <DescriptionComponent description={description} onSave={handleDescriptionSave} />
                <RecordedOnComponent startedAt = {activity.stats.startDate} endedAt = {activity.stats.endDate}/>
            </CardHeader>

            <CardContent>
                <StatContainerComponent 
                    durationS={activity.stats.totalDuration} 
                    distanceM={activity.stats.totalDistance} 
                    elevationGain={activity.stats.elevationGain} 
                    avgSpeed={activity.stats.avgSpeed} 
                />    
                <GraphComponent timedStats={activity.timedStats} />
            </CardContent>

        </Card>
    )
}