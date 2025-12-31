import {
    Card,    
    CardContent,
    CardDescription, // Infos wie Dauer, Länge
    CardFooter,
    CardHeader,
    CardTitle, // Name der Route
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export interface route {
    id: number,
    name: string,
    geoData: string
    distanceM: number,
    durationS: number,
    elevationGain : number,
    svgPreview: string
}



export function RouteCard({ id, name, distanceM, durationS, geoData, elevationGain, svgPreview } : route) {

    const calculateDistance = (distance : number) : number | string => {
        if (distance < 1000) {
            return distance + "m";
        }
        return (distance / 1000).toFixed(1) + "km";
    }

    const calculateDuration = (duration : number) : string => {
        if (duration < 60) return duration + "s";
        if (duration < 3600) return Math.floor(duration / 60) + "min";
        if (duration < 86400) return Math.floor(duration / 3600) + "h " + duration % 60 + "m";
        return Math.floor(duration / 86400) + "d " + (duration % 86400) + "h";
    }

    const router = useRouter();


    // TODO add routeId to the DTO? 
    // THen use it here to navigate the specific route
    
    return (
        <Card className="w-full max-w-lg">
            <CardHeader>
                <CardTitle className="text-black">{ name }</CardTitle>
                
                    <Button variant="default" onClick={() => router.push(`/navigate/${id}`)}> 
                        Navigate
                    </Button>
                
            </CardHeader>
            <CardContent>
                <span><p>{ calculateDistance(distanceM) }</p></span>
                <span><p>{ calculateDuration(durationS) }</p></span>
                <span><p>{ elevationGain + "m" }</p></span>
                <span dangerouslySetInnerHTML={{__html: svgPreview }}></span> 
            </CardContent>

        </Card>
    )
}