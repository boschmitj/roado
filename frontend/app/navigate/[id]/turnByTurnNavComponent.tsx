import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { computeDistanceString, formatInstruction } from "@/utils/formatter";
import { extractEtag } from "next/dist/server/image-optimizer";
import { format } from "path";

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
    nextInstruction: string,
    nextType: number,
    onClose: () => void;
}

export function InstructionComponent ({type, nextInstruction, nextType, instruction, nextDistance, distanceLeft, onClose} : InstructionComponentProps) {
    return (
        <div className="absolute z-10 top-2 left-1/2 -translate-x-1/2 w-sm">
            <Card className="min-w-2xs max-w-2xl w-sm relative">
                <CardHeader>
                    <CardTitle className="font-bold">
                        {formatInstruction(instruction, type)}
                    </CardTitle>
                    <CardDescription>
                        <p className="max-w-[200px]">
                            Next {formatInstruction(nextInstruction, nextType)} in {computeDistanceString(nextDistance + distanceLeft)}
                        </p>
                    </CardDescription>
                </CardHeader>
                <CardContent className="min-h-30" >   
                    <p className="max-w-[200px]">{instruction} <span>
                            <img 
                                src={`/images/nav_icons/${type}.svg`} 
                                className="h-25 absolute pt-2 pb-2 pr-4 right-2 top-1/2 -translate-y-1/2"
                                alt="Navigation instruction"
                            />
                        </span></p>
                    <p className="text-4xl font-extrabold ">{Math.round(distanceLeft) + "m"}</p>
                </CardContent>
                <CardFooter>
                    <Button variant="outline" onClick={onClose}>Close</Button>
                </CardFooter>
            </Card>
        </div>
    );
}