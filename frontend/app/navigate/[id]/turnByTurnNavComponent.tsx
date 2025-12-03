import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export interface Instruction {
    type: InstructionType,
    header: string,
    text: string,
    index: number,
    next: Instruction,
    completed: boolean,
    distance: number,
    oneWordInstruction: string,
}

enum InstructionType {
    LEFT,
    RIGHT,
    TURN_AROUND,
    STRAIGHT,
    ROUNDABOUT_1,
    ROUNDABOUT_2,
    ROUNDABOUT_3,
    ROUNDABOUT_4,
    ROUNDABOUT_5,
}

function InstructionComponent ({type, header, text, index, next, completed, distance} : Instruction) {
    return (
        <Card className="min-w-2xs max-w-2xl w-md">
            <CardHeader>
                <CardTitle>
                    {header}
                </CardTitle>
                <CardDescription>
                    <p>Next {next.oneWordInstruction} in {next.distance}</p>
                </CardDescription>
                </CardHeader>
            <CardContent>
                <p>{text}</p>
                <p className="text-xl font-extrabold">{distance}</p>
                <img src={`@/images/${type}`}/>
            </CardContent>
            <CardFooter>
                <Button variant="outline">Close</Button>
            </CardFooter>
        </Card>
    );
}