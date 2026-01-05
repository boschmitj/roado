import { Card, CardContent } from "@/components/ui/card";

export interface StatComponentProps {
    name: string;
    unit: string;
    value: number | string;
}
export default function StatComponent({unit, value, name} : StatComponentProps) {
    return (
        <Card className="flex flex-col justify-center items-center border-0 shadow-none">
            <CardContent className=""> 
                <p className="text-sm text-muted-foreground mb-1">{name}</p>
                <p className="text-2xl font-semibold">{value} {unit && <span className="text-xs font-normal">{unit}</span> }</p>       
            </CardContent>
        </Card>
    )
}