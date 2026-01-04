import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { RulerDimensionLine } from "lucide-react"

interface RouteStatisticComponentProps {
    value: number | string,
    statisticName: string,
    icon: React.ReactNode,
    furtherInfo?: React.ReactNode
}

export default function RouteStatisticComponent ({value, statisticName, furtherInfo, icon}: RouteStatisticComponentProps) {
    return (
        <Card className="gap-2 p-2 min-w-[14rem]">
            <CardHeader className='flex items-center justify-start gap-2 border-b-0 pt-2'>
                <div className='bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-md'>
                    {icon}
                </div>
                <span className='text-2xl '>{value}</span>
            </CardHeader>
            <CardContent className='flex flex-col gap-2 pt-0.5'>
                <span className='font-semibold text-lg'>{statisticName}</span>
                {furtherInfo && 
                    <div className='flex flex-row gap-2 text-muted-foreground text-sm'>
                        {furtherInfo}
                    </div>
                }
            </CardContent>
        </Card>
    )
}