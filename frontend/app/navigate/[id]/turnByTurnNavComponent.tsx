import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { computeDistanceString } from "@/utils/formatter";
import { extractEtag } from "next/dist/server/image-optimizer";

export interface Instruction {
    type: TurnType,
    header: string,
    text: string,
    index: number,
    next: Instruction,
    completed: boolean,
    distance: number,
    oneWordInstruction: string,
}

export interface Step {
    distance: number,
    duration: number,
    type: number,
    instruction: string,
    name: string,
    way_points: number[],
}

export enum TurnType {
    Left = 0,
    Right = 1,
    SharpLeft = 2,
    SharpRight = 3,
    SlightLeft = 4,
    SlightRight = 5,
    Straight = 6,
    EnterRoundabout = 7,
    ExitRoundabout = 8,
    UTurn = 9,
    Goal = 10,
    Depart = 11,
    KeepLeft = 12,
    KeepRight = 13,
}

interface InstructionComponentProps extends Step {
    distanceLeft: number,
    nextDistance: number,
}

export function InstructionComponent ({type, duration, instruction, nextDistance, distanceLeft} : InstructionComponentProps) {
    const threeWordInstructionTypes = [2,3,4,5,11] //mby 7, 8, and 12, 13 too
    return (
        <Card className="min-w-2xs max-w-2xl w-md">
            <CardHeader>
                <CardTitle>
                    {threeWordInstructionTypes.includes(type) ? 
                        instruction.split(" ").splice(0, 2).join(" ") :
                        instruction.split(" ").splice(0,3).join(" ")    
                    }
                </CardTitle>
                <CardDescription>
                    <p>Next in {computeDistanceString(nextDistance)}</p>
                </CardDescription>
                </CardHeader>
            <CardContent>
                <p>{instruction}</p>
                <p className="text-xl font-extrabold">{Math.round(distanceLeft) + "m"}</p>
                <img src={`@/images/${type}`}/>
            </CardContent>
            <CardFooter>
                <Button variant="outline">Close</Button>
            </CardFooter>
        </Card>
    );
}