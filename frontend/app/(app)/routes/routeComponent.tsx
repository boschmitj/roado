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
    distanceM: number,
    durationS: number,
    elevationGain : number,
    trackImageUrl: string,
}



export function RouteCard({ id, name, distanceM, durationS, elevationGain, trackImageUrl} : route) {

    console.log(trackImageUrl)

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
        <Card className="w-full max-w-lg" onClick={() => router.push(`routes/${id}`)}>
            <CardHeader className="flex ">
                <CardTitle className="text-black">{ name }</CardTitle>
                
                <Button variant="default" onClick={(e) => {
                        router.push(`/navigate/${id}`);
                        e.stopPropagation();
                    }}
                > 
                    Navigate
                </Button>
                
            </CardHeader>
            <CardContent className="flex gap-4">
                <div className="grid grid-cols-2 gap-4 flex-1">
                    <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Distance</span>
                        <span className="text-lg font-semibold">{ calculateDistance(distanceM) }</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Duration</span>
                        <span className="text-lg font-semibold">{ calculateDuration(durationS) }</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Elevation</span>
                        <span className="text-lg font-semibold">{ elevationGain + "m" }</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Speed</span>
                        <span className="text-lg font-semibold">
                            { durationS > 0 ? ((distanceM / 1000) / (durationS / 3600)).toFixed(1) + " km/h" : "N/A" }
                        </span>
                    </div>
                </div>
                
                <div className="w-32 h-full flex-shrink-0">
                    <img 
                        src={"http://localhost:8080" + trackImageUrl} 
                        alt={`${name} track preview`}
                        className=" h-full object-cover rounded-md"
                    />
                </div>
            </CardContent>

        </Card>
    )
}