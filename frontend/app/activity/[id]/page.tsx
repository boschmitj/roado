import { redirect } from "next/navigation";
import { serverFetch } from "@/lib/server-api";
import ActivityParentComponent from "./ActivityParentComponent";

interface ActivityPageProps {
  params: { id: string };
}

export default async function ActivityPage({ params }: { params: { id: string } }) {
    const { id } = await params;

    const apiUrl = `http://localhost:8080/activity/${id}`;

    const res = await serverFetch(apiUrl);

    if (res.status === 401) {
        redirect("/login"); 
    }

    console.log(res);

    
    return <ActivityParentComponent activity={res} activityId={Number(id)} />;
}
