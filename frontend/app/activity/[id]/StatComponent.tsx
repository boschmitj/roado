import { Card, CardContent } from "@/components/ui/card";

export interface StatComponentProps {
    name: string;
    unit: string;
    value: number | string;
}
export default function StatComponent({unit, value, name} : StatComponentProps) {
    return (
        <Card className="flex flex-col justify-center items-center min-h-12">
            <CardContent> 
                <p className="text-sm">{name}</p>
                <p className="text-2xl">{value}</p>
                { unit  && <p className="text-xs">{unit}</p> }          
            </CardContent>
        </Card>
    )
}