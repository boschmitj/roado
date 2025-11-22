import {
    Card,
    CardAction, // Diese Route navigieren
    CardContent,
    CardDescription, // Infos wie Dauer, Länge
    CardFooter,
    CardHeader,
    CardTitle, // Name der Route
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface route {
    routeName: string,
    geoData: string
    distanceM: number,
    durationS: number,
    elevationGain : number,
    svgPreview: string
}



export function RouteCard({ routeName, distanceM, durationS, geoData, elevationGain, svgPreview } : route) {

    const calculateDistance = (distance : number) : number | string => {
        if (distance < 1000) {
            return distance;
        }
        return (distance / 1000).toFixed(1);
    }

    const calculateDuration = (duration : number) : string => {
        if (duration < 60) return duration + "s";
        if (duration < 3600) return Math.floor(duration / 60) + "min";
        if (duration < 86400) return Math.floor(duration / 3600) + "h " + duration % 3600 + "m";
        return Math.floor(duration / 86400) + "d " + (duration % 86400) + "h";
    }


    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="text-black">{ routeName }</CardTitle>
                <CardAction>
                    <Button variant="default">
                        Navigate
                    </Button>
                </CardAction>
            </CardHeader>
            <CardContent>
                <span><p>{ calculateDistance(distanceM) }</p></span>
                <span><p>{ calculateDuration(durationS) }</p></span>
                <span><p>{ elevationGain }</p></span>
                <span dangerouslySetInnerHTML={{__html: svgPreview }}></span> 
            </CardContent>

        </Card>
    )
}